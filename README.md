# Discord Music Bot (Lavalink + Kawalink)

โปรเจกต์นี้คือบอท Discord สำหรับเล่นเพลงด้วย **Lavalink v4** โดยใช้ไลบรารี **kawalink** เป็นตัวเชื่อมต่อระหว่างบอทกับ Lavalink
รองรับคำสั่งแบบ Slash Command สำหรับควบคุมการเล่นเพลง และมีคำสั่งตรวจสถานะ node ของ Lavalink

---

## Features

- เล่นเพลงด้วย `/play`
- ปรับระดับเสียงด้วย `/volume`
- หยุด/ข้าม/เล่นต่อชั่วคราวด้วย `/stop`, `/skip`, `/pause`, `/resume`
- โหมดเล่นซ้ำด้วย `/loop`
- เปิด/ปิด Auto Play ด้วย `/autoplay`
- เช็คสถานะ Lavalink node ด้วย `/nodes` (Connected, Playing, CPU, Core, RAM, Uptime)

---

## Requirements

- Node.js 16+ (แนะนำ 18+)
- Discord Bot Token
- Lavalink v4 ที่เข้าถึงได้ หรือ สามารถใช้งานได้จาก lavalink ของเรา
- เปิด/ติดตั้ง Lavalink resolvers/plugins ให้รองรับแหล่งเพลงตามที่ต้องการ

---

## Configuration

ไฟล์ `config.json` อยู่ที่ระดับโปรเจกต์ มีรูปแบบประมาณนี้:

```json
{
  "token": "Bot Token",
  "nodes": [
    {
      "host": "lava.kasawa.pro",
      "port": 2333,
      "password": "youshallnotpass",
      "secure": false,
      "search": true,
      "identifier": "Non-SSL-Kasawa"
    },
    {
      "host": "lava3.kasawa.pro",
      "port": 433,
      "password": "youshallnotpass",
      "secure": true,
      "search": true,
      "identifier": "SSL-Kasawa"
    }
  ]
}
```

หมายเหตุ:
- `nodes[]` คุณใส่หลาย node ได้
- `secure` ใช้สำหรับ Lavalink ที่ใช้ SSL/TLS (ถ้า `true` จะต่อผ่าน `wss`/`https` ตามการตั้งค่าใน kawalink)

---

## Lavalink Supported Sources

โปรเจกต์นี้สามารถเล่น/ค้นหาแหล่งเพลงได้ ขึ้นอยู่กับ **resolver/plugins** ที่คุณติดตั้งบนฝั่ง Lavalink

หากใช้ Lavalink ของเรา สามารถเล่นเพลงได้ตามนี้:

- YouTube
- Spotify
- TikTok
- SoundCloud
- Apple Music
- Mixcloud

---

## Commands

คำสั่ง Slash Command ในโปรเจกต์นี้:

- `/play query:<string>` : เล่นเพลง
- `/pause` : หยุดเล่นชั่วคราว
- `/resume` : เล่นต่อ
- `/stop` : หยุดและล้างคิว
- `/skip` : ข้ามเพลงปัจจุบัน
- `/volume amount:<0-100>` : ปรับระดับเสียง
- `/loop mode:<track|queue|off>` : เล่นซ้ำ (เพลงปัจจุบัน/ทั้งคิว/ปิด)
- `/autoplay` : เปิด/ปิด เล่นเพลงอัติโนมัติ
- `/nodes` : แสดงสถานะ Lavalink node เครื่องเล่นเพลง

---

## Run

1. ติดตั้งแพ็กเกจ

```bash
npm i
```

2. ตั้งค่า `config.json`
3. รันบอท

```bash
node .
```

---
