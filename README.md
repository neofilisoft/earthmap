# 🌍 Earth Map - Interactive 3D Globe Explorer

เว็บไซต์ลูกโลกแบบ Google Earth ที่สร้างด้วย Three.js และ React ที่มีฟอนต์ Inter

## ✨ คุณสมบัติ

- **3D Globe Rendering** - ลูกโลก 3D แบบโต้ตอบที่สวยงาม
- **Interactive Controls** - หมุนด้วยการลาก, ซูมด้วยการเลื่อน
- **Touch Support** - รองรับการสัมผัสบนอุปกรณ์มือถือ
- **Responsive Design** - ทำงานได้ดีบนทุกขนาดจอ
- **Modern UI** - อินเตอร์เฟซที่สมัยใหม่ด้วยแอนิเมชั่น
- **High Performance** - ใช้ Three.js สำหรับเรนเดอร์ที่เหมาะสมที่สุด

## 📁 โครงสร้างไฟล์

```
earth-map/
├── index.html       # ไฟล์ HTML หลัก
├── style.css        # สไตล์ทั้งหมด
├── script.js        # Babylon-React component
└── README.md        # ไฟล์นี้
```

## 🚀 วิธีการใช้งาน

### วิธีที่ 1: เปิดไฟล์ HTML โดยตรง
1. ดาวน์โหลด `index.html`, `style.css`, และ `script.js`
2. เปิด `index.html` ในเบราว์เซอร์ของคุณ
3. เพลิดเพลินกับการสำรวจลูกโลก!

### วิธีที่ 2: ใช้เว็บเซิร์ฟเวอร์ (แนะนำ)
```bash
# ใช้ Python 3
python -m http.server 8000

# หรือ ใช้ Node.js
npx http-server

# แล้วเปิด http://localhost:8000
```

## 🎮 การควบคุม

### บนเดสก์ทอป
- **ลาก마우ส** - หมุนลูกโลก
- **เลื่อนเมาส์** - ซูมเข้า/ออก
- **Auto-rotate** - ลูกโลกหมุนเองเมื่อไม่มีการโต้ตอบ

### บนมือถือ
- **ลากนิ้ว** - หมุนลูกโลก
- **หนีบนิ้ว** - ซูมเข้า/ออก (pinch zoom)
- **ดับเบิลแท็พ** - ซูมเข้า

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
- **React 18** - UI library
- **Three.js** - 3D graphics
- **Babel** - JSX transpiler
- **Inter Font** - Google Fonts

### Features
- Canvas-based Earth texture
- Procedural continent generation
- Atmospheric glow effect
- Star field background
- Dynamic lighting

## 🎨 การปรับแต่ง

### เปลี่ยนสีลูกโลก
แก้ไขใน `script.js`:
```javascript
// Ocean color
ctx.fillStyle = '#0d47a1';

// Land color
ctx.fillStyle = '#2e7d32';
```

### ปรับความเร็วการหมุน
```javascript
// ค้นหาบรรทัดนี้และปรับค่า
globe.rotation.y += 0.0001;  // ค่าที่น้อยกว่า = หมุนช้าลง
```

### เปลี่ยนเรื่องสำคัญ
แก้ไขใน `index.html`:
```html
<title>ชื่อหน้าเว็บของคุณ</title>
```

## 📱 Responsive Breakpoints

- **Desktop**: > 768px
- **Tablet**: 480px - 768px
- **Mobile**: < 480px

UI ปรับตัวโดยอัตโนมัติสำหรับแต่ละขนาดอุปกรณ์

## ⚡ Performance Tips

1. **ลด stars count** - แก้ไข loop in `script.js`
2. **ลด geometry segments** - เปลี่ยน 128 เป็นจำนวนน้อยลง
3. **Disable shadows** - ตั้ง `castShadow = false`

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

Free to use and modify

## 🎯 Future Enhancements

- [ ] เพิ่มเมือง markers
- [ ] Weather data integration
- [ ] Satellite imagery
- [ ] Day/Night cycle
- [ ] Different globe styles
- [ ] VR support
- [ ] Multiple camera modes

## 🤝 Contribution

สามารถปรับปรุง fork และส่ง pull requests ได้

## 📞 Support

หากพบปัญหา โปรดตรวจสอบ:
1. เบราว์เซอร์เสนอการเข้าถึง WebGL
2. ไฟล์ลิงค์ได้อย่างถูกต้อง
3. ไม่มี CORS issues

---

**สร้างด้วย ❤️ using React + Three.js**
