# AgriEthos - Blockchain-Based Agricultural Traceability

AgriEthos.com is a decentralized application (dApp) that enhances transparency, authenticity, and efficiency in the agricultural supply chain using blockchain technology.

## 🚀 Features
- **Farmer Registration & Crop Data Storage**
  - Farmers register and input details about their land, crop type, and farming methods.
  - Submissions undergo a review process before being recorded on the blockchain.
  - Smart contracts store authenticity data, verifying organic certification and ethical farming practices.

- **Harvest & Processing Tracking**
  - Crops receive a unique digital ID (QR Code) linked to the blockchain upon harvest.
  - Processing plants scan and update product details for quality compliance.

- **Logistics & Supply Chain Management**
  - Each stage of transportation and handling is logged on the blockchain.
  - Smart contracts trigger alerts for storage condition violations.

- **Retail & Consumer Transparency**
  - Consumers can scan QR codes to access the full history of a product.
  - Retailers verify product authenticity with blockchain data.

## 🛠️ Tech Stack
- **Blockchain:** Ethereum
- **Smart Contracts:** Solidity 
- **Frontend:** Next.js (React)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (for off-chain data storage)

## 🏗️ Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/cybugg/agriethos.git
   cd AgriEthos
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```
   MONGO_URI=your_mongodb_connection_string
   BLOCKCHAIN_NODE_URL=your_blockchain_rpc_url
   ```
   4. Start the development server (Frontend):
      ```bash
      npm run dev
      ```

## 📜 Smart Contract Deployment
1. Navigate to the smart contract directory:
   ```bash
   cd contracts
   ```
2. Compile the contract:
   ```bash
   npx hardhat compile
   ```
3. Deploy to a testnet:
   ```bash
   npx hardhat run scripts/deploy.js --network testnet
   ```


---

# AgriEthos Backend

This is the backend server for **AgriEthos**, a decentralized platform where farmers can manage their farm properties and crops.  
The backend is built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- dotenv
- cors
- bcryptjs (optional if password hashing later)
- JWT (optional for token-based auth later)
- Ethers.js (for wallet signature verification)

---

## 📁 Project Structure

```bash
server/
├── controllers/
│   ├── authController.js
│   ├── farmPropertyController.js
│   └── cropController.js
├── models/
│   ├── Farmer.js
│   ├── FarmProperty.js
│   └── Crop.js
├── routes/
│   ├── authRoutes.js
│   ├── farmPropertyRoutes.js
│   └── cropRoutes.js
├── middleware/
│   └── authMiddleware.js
├── config/
│   └── db.js
├── server.js
├── .env
└── README.md
```

---

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/cybugg/agriethos-repo.git
cd agriethos-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key (optional for token auth)
```

### 4. Run the server

```bash
nodemon server (Install nodemon globally)
```

(Nodemon will auto-restart the server on changes.)

---

## 📡 API Endpoints

### Auth Routes

| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `POST` | `/api/auth/wallet-login` | Wallet-based login (address + signature) |
| `GET` | `/api/auth/check-auth` | Check if the user is authenticated |

---

### Farm Property Routes

| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `POST` | `/api/farm-properties` | Create a farm property |
| `GET` | `/api/farm-properties/:id` | Get farm property by ID |
| `PUT` | `/api/farm-properties/:id` | Update farm property |
| `DELETE` | `/api/farm-properties/:id` | Delete farm property |

---

### Crop Routes

| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `POST` | `/api/crops` | Create a crop linked to a farm property |
| `GET` | `/api/crops/:id` | Get crop by ID |
| `PUT` | `/api/crops/:id` | Update crop |
| `DELETE` | `/api/crops/:id` | Delete crop |

---

## 🛡️ Security

- Signature verification with Ethers.js.
- Future implementation: JWT authentication and access control (optional).
- Only the farmer who owns a farm property can update it (authorization layer).

---

## 📦 Future Enhancements

- Connect with decentralized storage for farm images (IPFS, MiniIO, or S3).
- Implement notification system for farmers.
- Full audit trail (tracking changes).

---


## 💰 Revenue Model
- Transaction fees for blockchain records
- Subscription plans for farmers and businesses
- QR code branding for product traceability
- Data analytics services for farm insights

## 🤝 Contribution
Contributions are welcome! Please follow the standard GitHub flow:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Submit a pull request

## 📄 License
This project is licensed under the **Proprietary License**, meaning all rights are reserved. Unauthorized copying, distribution, modification, or commercial use of any part of this project is strictly prohibited without prior written permission from AgriEthos. See the [LICENSE](/LICENSE) file for details.


---
Maintained by [AgriEthos Team](https://agriethos.com) 🌿
