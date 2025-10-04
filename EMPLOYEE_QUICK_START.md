# 🚀 Employee Quick Start Guide

## 📋 Quick Reference

### Login
```
URL: http://localhost:3000
Email: employee@company.com
Password: employee123456
```

---

## 🎯 What You Can Do

| Feature | How to Access | Description |
|---------|--------------|-------------|
| **Dashboard** | Click "Dashboard" in sidebar | View statistics and recent expenses |
| **Submit Expense** | Click "Submit New Expense" button | Create new expense claim |
| **View Expenses** | Click "My Expenses" in sidebar | See all your expenses |
| **View Details** | Click eye icon on any expense | See full expense information |
| **Edit Expense** | Click pencil icon (pending only) | Update expense details |
| **Delete Expense** | Click trash icon (pending only) | Remove expense |
| **Use OCR** | Upload receipt → Click "Scan with OCR" | Auto-extract expense details |

---

## 📝 Submit Expense (Quick Steps)

1. Click **"Submit New Expense"** (green button)
2. Fill in required fields:
   - ✅ Title (e.g., "Client Dinner")
   - ✅ Category (select from dropdown)
   - ✅ Date (select date)
   - ✅ Amount (enter number)
   - ✅ Currency (select currency)
3. Optional: Upload receipt image
4. Optional: Use OCR to auto-fill
5. Click **"Submit Expense"**
6. Done! ✅

---

## 🔍 Search & Filter Expenses

### Search
- Type in search box to find expenses by:
  - Title
  - Description
  - Category

### Filter by Status
- All Status
- Pending (waiting for approval)
- Approved (accepted)
- Rejected (declined)
- Reimbursed (paid)

### Filter by Category
- Food
- Transportation
- Accommodation
- Office Supplies
- Travel
- Entertainment
- Communication
- Training
- Other

---

## 📊 Expense Status Meanings

| Status | Icon | Meaning | Can Edit? | Can Delete? |
|--------|------|---------|-----------|-------------|
| **Pending** | 🟡 | Waiting for approval | ✅ Yes | ✅ Yes |
| **Approved** | 🟢 | Accepted by manager/admin | ❌ No | ❌ No |
| **Rejected** | 🔴 | Declined (see reason) | ❌ No | ❌ No |
| **Reimbursed** | 🔵 | Payment processed | ❌ No | ❌ No |

---

## 🎨 Dashboard Statistics

### Cards Explained

1. **Total Expenses** (Blue)
   - All expenses you've submitted

2. **Pending** (Yellow)
   - Expenses waiting for approval

3. **Approved** (Green)
   - Expenses that were accepted

4. **Rejected** (Red)
   - Expenses that were declined

5. **Total Amount Claimed** (Purple)
   - Sum of all your expense amounts

6. **Approved Amount** (Teal)
   - Sum of approved expense amounts

---

## 🔄 Approval Workflow

### Your Expense Journey

```
1. Submit Expense
   ↓
2. Under Review (Pending)
   ↓
3. Manager/Admin Reviews
   ↓
4. Decision:
   → Approved ✅ → Reimbursed 💰
   → Rejected ❌ (see reason)
```

### Timeline View
- ✅ **Submitted** - When you created it
- ⏳ **Under Review** - Being reviewed
- ✅/❌ **Decision** - Approved or Rejected

---

## 📸 OCR Feature (Receipt Scanning)

### How to Use OCR

1. **Upload Receipt**
   ```
   Click "Choose File" → Select image
   ```

2. **Scan Receipt**
   ```
   Click "Scan with OCR" → Wait 2 seconds
   ```

3. **Review & Edit**
   ```
   Check auto-filled fields → Make corrections
   ```

4. **Submit**
   ```
   Click "Submit Expense"
   ```

### What OCR Extracts
- ✅ Merchant name (as title)
- ✅ Amount
- ✅ Date
- ✅ Category (guessed)

### File Requirements
- **Format**: PNG, JPG, GIF
- **Max Size**: 5MB
- **Quality**: Clear, readable text

---

## ⚡ Quick Actions

### From Dashboard
- **Submit Expense** → Create new claim
- **View Expenses** → See all claims
- **Notifications** → Check updates

### From My Expenses
- **👁️ Eye Icon** → View details
- **✏️ Pencil Icon** → Edit (pending only)
- **🗑️ Trash Icon** → Delete (pending only)

---

## 🚫 What You Cannot Do

- ❌ Approve or reject expenses
- ❌ View other employees' expenses
- ❌ Create or manage users
- ❌ Edit approved/rejected expenses
- ❌ Delete approved/rejected expenses
- ❌ Access company settings
- ❌ Manage approval rules

---

## 📱 Navigation Menu

### Sidebar Items
1. **Dashboard** - Home page with stats
2. **My Expenses** - All your expenses
3. **Notifications** - Updates on your claims
4. **Settings** - Your profile settings

---

## 💡 Pro Tips

### ✅ Do's
- ✅ Upload clear receipt images
- ✅ Fill in detailed descriptions
- ✅ Submit expenses promptly
- ✅ Review OCR results before submitting
- ✅ Check rejection reasons to improve future claims
- ✅ Keep receipts organized

### ❌ Don'ts
- ❌ Don't submit duplicate expenses
- ❌ Don't submit personal expenses
- ❌ Don't forget to attach receipts
- ❌ Don't submit expenses without proper details
- ❌ Don't edit expenses after submission (unless pending)

---

## 🔔 Notifications

### You'll Get Notified When:
- ✅ Your expense is approved
- ❌ Your expense is rejected
- 💰 Your expense is reimbursed
- 📝 Additional information is needed

---

## 🆘 Common Issues

### Can't Submit Expense?
- Check all required fields are filled
- Ensure amount is greater than 0
- Verify date is not in the future
- Check receipt file size (max 5MB)

### Can't Edit Expense?
- Only pending expenses can be edited
- Approved/rejected expenses are locked
- Check if you're the owner of the expense

### Can't Delete Expense?
- Only pending expenses can be deleted
- Approved/rejected expenses cannot be removed
- Contact admin if you need to delete approved expense

### OCR Not Working?
- Ensure receipt image is clear
- Check file format (PNG, JPG, GIF)
- Verify file size is under 5MB
- Try uploading a different image

---

## 📞 Need Help?

### Documentation
- **EMPLOYEE_DASHBOARD_GUIDE.md** - Complete guide
- **COMPLETE_SETUP_SUMMARY.md** - System overview
- **POSTMAN_API_GUIDE.md** - API reference

### Contact
- Ask your manager for approval issues
- Contact admin for account issues
- Check notifications for updates

---

## 🎯 Common Workflows

### Workflow 1: Submit Simple Expense
```
1. Click "Submit New Expense"
2. Enter title: "Taxi to Client Meeting"
3. Select category: "Transportation"
4. Enter amount: 25.00
5. Select date: Today
6. Click "Submit Expense"
```

### Workflow 2: Submit with Receipt
```
1. Click "Submit New Expense"
2. Click "Choose File" → Select receipt
3. Click "Scan with OCR"
4. Review auto-filled data
5. Make corrections if needed
6. Click "Submit Expense"
```

### Workflow 3: Edit Pending Expense
```
1. Go to "My Expenses"
2. Find pending expense
3. Click pencil icon
4. Update fields
5. Click "Update Expense"
```

### Workflow 4: Check Expense Status
```
1. Go to "My Expenses"
2. Click eye icon on expense
3. View approval workflow
4. Check current status
5. Read rejection reason (if rejected)
```

---

## 📊 Expense Categories

| Category | Examples |
|----------|----------|
| **Food** | Meals, snacks, coffee |
| **Transportation** | Taxi, bus, train, parking |
| **Accommodation** | Hotel, lodging |
| **Office Supplies** | Stationery, equipment |
| **Travel** | Flights, car rental |
| **Entertainment** | Client entertainment |
| **Communication** | Phone, internet |
| **Training** | Courses, conferences |
| **Other** | Miscellaneous |

---

## 💰 Supported Currencies

- USD - US Dollar
- EUR - Euro
- GBP - British Pound
- INR - Indian Rupee
- CAD - Canadian Dollar
- AUD - Australian Dollar
- JPY - Japanese Yen

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Search expenses | Click search box |
| Submit new expense | Click green button |
| Navigate back | Browser back button |
| Refresh page | F5 or Ctrl+R |

---

## 🎉 You're All Set!

Now you can:
- ✅ Submit expense claims
- ✅ Track approval status
- ✅ View expense history
- ✅ Use OCR for receipts
- ✅ Manage your expenses

**Happy Expensing! 🚀**