const mongoose = require('mongoose');
const Tour = require('./models/tourModel');

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/ToursCheapTripDB');

// Mapping tên tour với destination (có thể điều chỉnh theo dữ liệu thực tế)
const tourDestinationMapping = {
  'Đà Lạt': 'Đà Lạt',
  'Nha Trang': 'Nha Trang', 
  'Vịnh Hạ Long': 'Vịnh Hạ Long',
  'Phú Quốc': 'Phú Quốc',
  'Hội An': 'Hội An',
  'Sa Pa': 'Sa Pa',
  'Mũi Né': 'Mũi Né',
  'Đà Nẵng': 'Đà Nẵng',
  'Huế': 'Huế',
  'Hạ Long': 'Hạ Long',
  'Tam Cốc': 'Tam Cốc',
  'Thác Bản Giốc': 'Thác Bản Giốc',
  'Fansipan': 'Fansipan',
  'Mai Châu': 'Mai Châu',
  'Ba Bể': 'Ba Bể'
};

async function updateDestinations() {
  try {
    console.log('Bắt đầu cập nhật trường destination...');
    
    const tours = await Tour.find({});
    console.log(`Tìm thấy ${tours.length} tours cần cập nhật`);
    
    for (const tour of tours) {
      // Tìm destination dựa trên tên tour
      let destination = null;
      for (const [key, value] of Object.entries(tourDestinationMapping)) {
        if (tour.name && tour.name.includes(key)) {
          destination = value;
          break;
        }
      }
      
      // Nếu không tìm thấy, có thể set giá trị mặc định
      if (!destination) {
        destination = 'Khác';
      }
      
      // Cập nhật trường destination
      await Tour.findByIdAndUpdate(tour._id, { destination });
      console.log(`Đã cập nhật tour: ${tour.name} -> destination: ${destination}`);
    }
    
    console.log('Hoàn thành cập nhật destination!');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi cập nhật destination:', error);
    process.exit(1);
  }
}

// Chạy script
updateDestinations(); 