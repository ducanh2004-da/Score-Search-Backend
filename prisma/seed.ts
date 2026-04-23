process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as https from 'https';
import csv = require('csv-parser');
import 'dotenv/config';

// 1. Tạo Pool kết nối
// Sửa đổi phần khởi tạo Pool:
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  }
});

// 2. Gắn vào Adapter
const adapter = new PrismaPg(pool);

// 3. Khởi tạo PrismaClient với Adapter (Đây là điểm mấu chốt fix lỗi)
const prisma = new PrismaClient({ adapter });

const CSV_URL = 'https://raw.githubusercontent.com/GoldenOwlAsia/webdev-intern-assignment-3/refs/heads/main/dataset/diem_thi_thpt_2024.csv';
const BATCH_SIZE = 5000;

async function main() {
  console.log(`Đang kết nối tới: ${CSV_URL}`);
  let batch: any[] = [];
  let totalInserted = 0;

  return new Promise((resolve, reject) => {
    https.get(CSV_URL, (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Lỗi khi tải file: Status Code ${response.statusCode}`));
      }

      console.log('Bắt đầu tải stream và parse dữ liệu...');
      
      const stream = response.pipe(csv());

      stream.on('data', async (data) => {
        // Hàm parse: Nếu rỗng giữ null, có giá trị thì ép kiểu số thực
        const parseField = (val: string) => (val && val.trim() !== '' ? parseFloat(val) : null);

        batch.push({
          sbd: data['sbd'],
          toan: parseField(data['toan']),
          ngu_van: parseField(data['ngu_van']),
          ngoai_ngu: parseField(data['ngoai_ngu']),
          vat_li: parseField(data['vat_li']),
          hoa_hoc: parseField(data['hoa_hoc']),
          sinh_hoc: parseField(data['sinh_hoc']),
          lich_su: parseField(data['lich_su']),
          dia_li: parseField(data['dia_li']),
          gdcd: parseField(data['gdcd']),
          ma_ngoai_ngu: data['ma_ngoai_ngu'] || null,
        });

        // KHI BATCH ĐẠT TỚI GIỚI HẠN (Vd: 5000 dòng)
        if (batch.length >= BATCH_SIZE) {
          // 1. Tạm dừng stream từ Github để tránh việc RAM tiếp tục phình to
          stream.pause();
          
          // 2. Clone batch hiện tại và làm rỗng mảng gốc ngay lập tức để giải phóng bộ nhớ
          const batchToInsert = [...batch];
          batch = []; 

          try {
            // 3. Insert lô dữ liệu vào PostgreSQL
            await prisma.score.createMany({
              data: batchToInsert,
              skipDuplicates: true, // Bỏ qua nếu SBD đã tồn tại để tránh lỗi crash nửa chừng
            });
            
            totalInserted += batchToInsert.length;
            console.log(`Đã insert ${totalInserted} dòng...`);
            
            // 4. Mở lại stream để tiếp tục đọc dữ liệu
            stream.resume();
          } catch (error) {
            console.error('Lỗi khi insert batch:', error);
            stream.destroy(); // Hủy stream nếu lỗi DB
            reject(error);
          }
        }
      });

      stream.on('end', async () => {
        // XỬ LÝ LÔ DỮ LIỆU CUỐI CÙNG (nếu còn sót lại chưa đủ 5000)
        if (batch.length > 0) {
          try {
            await prisma.score.createMany({
              data: batch,
              skipDuplicates: true,
            });
            totalInserted += batch.length;
          } catch (error) {
            console.error('Lỗi khi insert lô cuối:', error);
            return reject(error);
          }
        }
        console.log(`✅ Seeding hoàn tất! Tổng cộng đã thêm: ${totalInserted} dòng.`);
        resolve(true);
      });

      stream.on('error', (error) => {
        console.error('Lỗi trong quá trình parse CSV:', error);
        reject(error);
      });

    }).on('error', (error) => {
      console.error('Lỗi Network khi tải file từ Github:', error);
      reject(error);
    });
  });
}

main()
  .catch((e) => {
    console.error('Seeder thất bại:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });