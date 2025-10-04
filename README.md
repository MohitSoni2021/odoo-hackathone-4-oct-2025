# 💰 Expense Management System

[![Watch the demo](https://img.youtube.com/vi/HSqMKP2mD6c/maxresdefault.jpg)](https://youtu.be/HSqMKP2mD6c)



## 📌 Overview
Companies often struggle with **manual expense reimbursement processes** that are time-consuming, error-prone, and lack transparency.  
This project provides a **modern Expense Management System** to simplify **expense submission, approval workflows, and reimbursement tracking** with support for **multi-level approvals, conditional rules, and OCR-based automation**.

---

## 🚀 Features

### 🔐 Authentication & User Management
- Auto-create **Company** (with default currency) and **Admin** user on signup.
- Admin can:
  - Create Employees & Managers.  
  - Assign and change roles (Employee, Manager).  
  - Define reporting relationships.  

### 🧾 Expense Submission (Employee Role)
- Submit expense claims with:
  - Amount (supports different currencies).  
  - Category, Description, Date.  
- View personal expense history (Approved/Rejected).  

### ✅ Approval Workflow (Manager/Admin Role)
- Multi-step approval flow:
  - Example: Manager → Finance → Director.  
- Managers can:
  - View expenses pending approval.  
  - Approve/Reject with comments.  

### ⚖️ Conditional Approval Flow
- Approval rules:
  - **Percentage Rule** – e.g., 60% of approvers approve → Expense approved.  
  - **Specific Approver Rule** – e.g., CFO approval → Auto-approved.  
  - **Hybrid Rule** – Combine both conditions.  
- Support for **multi-level + conditional** approvals together.  

### 🧑‍💻 Role Permissions
- **Admin** → Manage company, users, roles, rules, override approvals.  
- **Manager** → Approve/reject expenses, view team expenses, escalate.  
- **Employee** → Submit expenses, view status/history.  

### 📸 OCR for Receipts
- Upload/scan receipts.  
- OCR auto-fills expense details: Amount, Date, Description, Expense Type, Vendor (e.g., restaurant name).  

---

## 🌍 APIs Used
- **Country & Currency API** → [REST Countries](https://restcountries.com/v3.1/all?fields=name,currencies)  
- **Currency Conversion API** → [ExchangeRate API](https://api.exchangerate-api.com/v4/latest/{BASE_CURRENCY})  

---

## 🖼️ Mockup
- Excalidraw Mockup: [View Design](https://link.excalidraw.com/l/65VNwvy7c4X/4WSLZDTrhkA)  

---

## 🏗️ Tech Stack (Recommended)
- **Frontend**: React.js (Material UI / TailwindCSS)  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB / PostgreSQL  
- **Authentication**: JWT / OAuth  
- **OCR**: Tesseract.js or any cloud OCR API  

---

## 📂 Folder Structure (Example)
```
expense-management-system/
│── backend/         # Express.js APIs (Auth, Expense, Approvals)
│── frontend/        # React.js Frontend (UI Components, Views)
│── docs/            # Documentation & mockups
│── database/        # DB models, schemas, seed data
│── README.md        # Project documentation
```

---

## 🎯 Future Enhancements
- Analytics Dashboard (spending trends, department-wise reports).  
- Mobile App for quick expense submissions.  
- Integration with Payroll/ERP systems.  
- AI-based fraud detection for expense claims.  

---

## 👨‍💻 Roles in the System
- **Admin** – Full control.  
- **Manager** – Approvals, escalations.  
- **Employee** – Submit & track expenses.  
