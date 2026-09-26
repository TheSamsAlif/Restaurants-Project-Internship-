import { defineStore } from 'pinia'

const translations = {
  en: {
    // Nav & Layout
    nav: {
      setup: 'Restaurant Setup',
      items: 'All Items',
      orders: 'New Order',
      invoices: 'Invoices & Reports',
      revenue: 'Daily Revenue',
      logout: 'Sign Out',
      lightMode: 'Switch to Light Mode',
      darkMode: 'Switch to Dark Mode',
      langToggle: 'বাংলা',
    },
    // Auth
    auth: {
      staffPortal: 'Staff Portal',
      welcomeBack: 'Welcome Back',
      email: 'Email Address',
      password: 'Password',
      signIn: 'Sign In',
      noAccount: "Don't have an account?",
      registerHere: 'Register here',
      newAccount: 'New Account',
      createAccount: 'Create Account',
      fullName: 'Full Name',
      phone: 'Phone Number',
      confirmPassword: 'Confirm Password',
      completeReg: 'Complete Registration',
      hasAccount: 'Already have an account?',
      signInLink: 'Sign in',
      kitchenLive: 'Kitchen Live & POS Connected',
      heroTitle: 'Smart Restaurant Management & Retail POS',
      heroSubtitle: 'Manage live billing, table seating, menu items, and daily revenue with ease.',
    },
    // Setup
    setup: {
      badge: 'Step 2: Configuration',
      title: 'My Restaurant Setup',
      subtitle: 'Manage restaurant profile, logo, branches, and quick shortcuts.',
      addBtn: 'Add Restaurant',
      quickNav: 'Quick Navigation:',
      allItems: 'All Items Page',
      ordersPage: 'Orders Page',
      invoicePage: 'Invoice Page',
      noRestaurant: 'No Restaurant Configured',
      noRestaurantDesc: 'Add your restaurant details to start managing menu items and orders.',
      setUpBtn: 'Set Up Restaurant',
      active: 'Active',
      branches: 'Branches:',
      setActive: 'Set as Active',
      editTitle: 'Edit Restaurant Info',
      newTitle: 'Add New Restaurant',
      nameLabel: 'Restaurant Name *',
      addressLabel: 'Address *',
      phoneLabel: 'Phone Number *',
      branchesLabel: 'Branch Name(s)',
      branchesHint: 'Type branch name and press Enter',
      uploadLogo: 'Upload Logo',
      removeLogo: 'Remove logo',
      logoHint: 'PNG or JPG up to 2MB',
      saveChanges: 'Save Changes',
      createRestaurant: 'Create Restaurant',
    },
    // Items
    items: {
      badge: 'Step 3: Menu Management',
      title: 'All Restaurant Items',
      showing: 'Showing {count} of {total} menu items',
      loadSample: 'Load Sample Menu',
      addItem: 'Add New Item',
      searchPlaceholder: 'Search items by name...',
      filterLabel: 'Filter by Category',
      allCategories: 'All Categories',
      emptyTitle: 'No Menu Items Yet',
      emptyDesc: 'Add your food and beverage items or load the starter menu.',
      price: 'Price:',
      editItem: 'Edit Menu Item',
      newItem: 'Add New Menu Item',
      itemName: 'Item Name *',
      category: 'Category *',
      priceLabel: 'Price *',
      imageUrl: 'Image URL (optional)',
      imageHint: 'Paste image link or choose preset below',
    },
    // Order
    orders: {
      badge: 'Step 4: Retail POS',
      title: 'New Dining Order',
      subtitle: 'Select items, choose table and seat, and generate live invoice.',
      searchPlaceholder: 'Search menu items...',
      currentOrder: 'Current Order',
      itemsCount: '{count} items',
      noItems: 'No items selected',
      tapToAdd: 'Click items on the left to add to order',
      subtotal: 'Subtotal:',
      vat: 'VAT ({rate}%):',
      total: 'Total Amount:',
      customerDetails: 'Customer & Table Seating',
      customerName: 'Customer Name *',
      phone: 'Phone Number *',
      tableNo: 'Table Number *',
      seatNo: 'Seat Number',
      selectBranch: 'Select Branch',
      submitBtn: 'Submit Order & View Invoice',
      tableMapTitle: 'Interactive Table Map',
      tableStatusFree: 'Free',
      tableStatusBusy: 'Occupied',
      tableOccupiedBy: 'Occupied by: {name}',
    },
    // Invoices & Revenue
    invoices: {
      badge: 'Step 5: Ledger & Records',
      title: 'Invoices & Reports',
      subtitle: 'Browse, view, download, and print past and upcoming dining invoices.',
      newOrderBtn: 'New Order',
      searchPlaceholder: 'Search by customer name, invoice #, or table number...',
      upcoming: 'Upcoming Orders',
      previous: 'Previous Orders',
      view: 'View Details',
      print: 'Print',
      pdf: 'PDF',
      text: 'Text',
      markDone: 'Mark as Completed',
      reopen: 'Move back to Upcoming',
      invoiceNo: 'Invoice No:',
      dateTime: 'Date & Time:',
      customer: 'Customer:',
      seating: 'Seating:',
      completedAt: 'Completed At:',
      itemsOrdered: 'Items Ordered',
      thankYou: 'Thank you for dining with us!',
      detailsTab: 'Details & History',
      slipTab: 'Thermal Slip',
      timeline: 'Order Timeline',
      orderPlaced: 'Order Placed',
      kitchenPrep: 'Kitchen Preparation',
      completedServed: 'Completed & Served',
      customerDetails: 'Customer & Seating Details',
      table: 'Table',
      seat: 'Seat',
      phone: 'Phone',
      qty: 'Qty',
      unitPrice: 'Unit Price',
      amount: 'Amount',
      subtotal: 'Subtotal',
      vat: 'VAT',
      total: 'Total',
      emptyToday: 'No orders recorded today yet.',
    },
    revenue: {
      title: "Today's POS Performance & Revenue",
      totalRevenue: "Today's Revenue",
      totalOrders: "Today's Orders",
      avgOrder: 'Avg. Order Value',
      completedSales: 'Completed Sales',
      pendingSales: 'In-Kitchen Sales',
      topDishes: 'Top Selling Items Today',
    },
  },
  bn: {
    // Nav & Layout
    nav: {
      setup: 'রেস্তোরাঁ সেটআপ',
      items: 'সব মেনু আইটেম',
      orders: 'নতুন অর্ডার (POS)',
      invoices: 'ইনভয়েস ও রিপোর্ট',
      revenue: 'দৈনিক আয়',
      logout: 'লগআউট',
      lightMode: 'লাইট মোডে যান',
      darkMode: 'ডার্ক মোডে যান',
      langToggle: 'English',
    },
    // Auth
    auth: {
      staffPortal: 'স্টাফ পোর্টাল',
      welcomeBack: 'স্বাগতম!',
      email: 'ইমেইল অ্যাড্রেস',
      password: 'পাসওয়ার্ড',
      signIn: 'সাইন ইন করুন',
      noAccount: 'কোনো অ্যাকাউন্ট নেই?',
      registerHere: 'এখানে রেজিস্ট্রেশন করুন',
      newAccount: 'নতুন অ্যাকাউন্ট',
      createAccount: 'অ্যাকাউন্ট তৈরি করুন',
      fullName: 'পুরো নাম',
      phone: 'ফোন নাম্বার',
      confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
      completeReg: 'রেজিস্ট্রেশন সম্পন্ন করুন',
      hasAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
      signInLink: 'সাইন ইন করুন',
      kitchenLive: 'লাইভ কিচেন ও POS সংযুক্ত',
      heroTitle: 'স্মার্ট রেস্তোরাঁ ম্যানেজমেন্ট ও রিটেইল POS',
      heroSubtitle: 'লাইভ বিলিং, টেবিল সিটিং, মেনু আইটেম ও দৈনিক আয়ের হিসাব রাখুন সহজে।',
    },
    // Setup
    setup: {
      badge: 'ধাপ ২: কনফিগারেশন',
      title: 'আমার রেস্তোরাঁ সেটআপ',
      subtitle: 'রেস্তোরাঁর প্রোফাইল, লোগো, ব্রাঞ্চ এবং দ্রুত নেভিগেশন লিংক ম্যানেজ করুন।',
      addBtn: 'রেস্তোরাঁ যোগ করুন',
      quickNav: 'দ্রুত নেভিগেশন:',
      allItems: 'সব আইটেম পেজ',
      ordersPage: 'অর্ডার পেজ',
      invoicePage: 'ইনভয়েস পেজ',
      noRestaurant: 'কোনো রেস্তোরাঁ কনফিগার করা নেই',
      noRestaurantDesc: 'মেনু আইটেম ও অর্ডার পরিচালনা শুরু করতে রেস্তোরাঁর তথ্য যোগ করুন।',
      setUpBtn: 'রেস্তোরাঁ সেটআপ করুন',
      active: 'সক্রিয়',
      branches: 'শাখা/ব্রাঞ্চ:',
      setActive: 'সক্রিয় হিসেবে নির্বাচন করুন',
      editTitle: 'রেস্তোরাঁর তথ্য পরিবর্তন করুন',
      newTitle: 'নতুন রেস্তোরাঁ যোগ করুন',
      nameLabel: 'রেস্তোরাঁর নাম *',
      addressLabel: 'ঠিকানা *',
      phoneLabel: 'ফোন নাম্বার *',
      branchesLabel: 'শাখা / ব্রাঞ্চের নাম',
      branchesHint: 'ব্রাঞ্চের নাম লিখে Enter চাপুন',
      uploadLogo: 'লোগো আপলোড',
      removeLogo: 'লোগো মুছুন',
      logoHint: 'PNG বা JPG সর্বোচ্চ ২ মেগাবাইট',
      saveChanges: 'পরিবর্তন সংরক্ষণ করুন',
      createRestaurant: 'রেস্তোরাঁ তৈরি করুন',
    },
    // Items
    items: {
      badge: 'ধাপ ৩: মেনু ম্যানেজমেন্ট',
      title: 'সব রেস্তোরাঁ আইটেম',
      showing: 'মোট {total} টির মধ্যে {count} টি আইটেম প্রদর্শিত',
      loadSample: 'ডেমো মেনু লোড করুন',
      addItem: 'নতুন আইটেম যোগ করুন',
      searchPlaceholder: 'আইটেমের নাম দিয়ে খুঁজুন...',
      filterLabel: 'ক্যাটাগরি ফিল্টার',
      allCategories: 'সকল ক্যাটাগরি',
      emptyTitle: 'কোনো মেনু আইটেম নেই',
      emptyDesc: 'খাবার ও পানীয় আইটেম যোগ করুন অথবা ডেমো মেনু লোড করুন।',
      price: 'মূল্য:',
      editItem: 'মেনু আইটেম এডিট করুন',
      newItem: 'নতুন মেনু আইটেম যোগ করুন',
      itemName: 'আইটেমের নাম *',
      category: 'ক্যাটাগরি *',
      priceLabel: 'মূল্য *',
      imageUrl: 'ছবির লিংক (ঐচ্ছিক)',
      imageHint: 'ছবির URL দিন অথবা নিচের প্রিসেট থেকে বেছে নিন',
    },
    // Order
    orders: {
      badge: 'ধাপ ৪: রিটেইল POS',
      title: 'নতুন ডাইনিং অর্ডার',
      subtitle: 'মেনু থেকে খাবার নির্বাচন করুন, টেবিল ও সিট দিন এবং লাইভ ইনভয়েস তৈরি করুন।',
      searchPlaceholder: 'মেনু আইটেম খুঁজুন...',
      currentOrder: 'বর্তমান অর্ডার',
      itemsCount: '{count} টি আইটেম',
      noItems: 'কোনো আইটেম নির্বাচন করা হয়নি',
      tapToAdd: 'অর্ডারে যোগ করতে বামের আইটেমগুলোতে ক্লিক করুন',
      subtotal: 'সাবটোটাল:',
      vat: 'ভ্যাট ({rate}%):',
      total: 'সর্বমোট বিল:',
      customerDetails: 'কাস্টমার ও টেবিল সিটিং',
      customerName: 'কাস্টমারের নাম *',
      phone: 'ফোন নাম্বার *',
      tableNo: 'টেবিল নাম্বার *',
      seatNo: 'সিট নাম্বার',
      selectBranch: 'ব্রাঞ্চ নির্বাচন করুন',
      submitBtn: 'অর্ডার সাবমিট ও ইনভয়েস দেখুন',
      tableMapTitle: 'ইন্টারেক্টিভ টেবিল ম্যাপ',
      tableStatusFree: 'ফ্রি',
      tableStatusBusy: 'বুক করা',
      tableOccupiedBy: 'বুক করেছেন: {name}',
    },
    // Invoices & Revenue
    invoices: {
      badge: 'ধাপ ৫: লেজার ও রেকর্ড',
      title: 'ইনভয়েস ও রিপোর্ট',
      subtitle: 'অর্ডারের বিবরণ দেখুন, প্রিন্ট করুন এবং PDF ইনভয়েস ডাউনলোড করুন।',
      newOrderBtn: 'নতুন অর্ডার',
      searchPlaceholder: 'কাস্টমারের নাম, ইনভয়েস নম্বর বা টেবিল দিয়ে খুঁজুন...',
      upcoming: 'চলমান অর্ডারসমূহ',
      previous: 'সম্পন্ন হওয়া অর্ডারসমূহ',
      view: 'বিস্তারিত দেখুন',
      print: 'প্রিন্ট',
      pdf: 'PDF',
      text: 'টেক্সট',
      markDone: 'সম্পন্ন হিসেবে চিহ্নিত করুন',
      reopen: 'আবার চলমানে ফেরত নিন',
      invoiceNo: 'ইনভয়েস নং:',
      dateTime: 'তারিখ ও সময়:',
      customer: 'কাস্টমার:',
      seating: 'সিটিং:',
      completedAt: 'সম্পন্ন হওয়ার সময়:',
      itemsOrdered: 'অর্ডারকৃত আইটেমসমূহ',
      thankYou: 'আমাদের রেস্তোরাঁয় আসার জন্য ধন্যবাদ!',
      detailsTab: 'অর্ডার বিবরণ ও ইতিহাস',
      slipTab: 'প্রিন্ট রসিদ স্লিপ',
      timeline: 'অর্ডার টাইমলাইন',
      orderPlaced: 'অর্ডার গ্রহণ',
      kitchenPrep: 'কিচেন প্রস্তুতি',
      completedServed: 'সম্পন্ন ও পরিবেশিত',
      customerDetails: 'গ্রাহক ও সিটিং তথ্য',
      table: 'টেবিল',
      seat: 'সিট',
      phone: 'ফোন',
      qty: 'পরিমাণ',
      unitPrice: 'একক মূল্য',
      amount: 'মোট',
      subtotal: 'সাবটোটাল',
      vat: 'ভ্যাট',
      total: 'সর্বমোট বিল',
      emptyToday: 'আজকে এখনও কোনো অর্ডার গ্রহণ করা হয়নি।',
    },
    revenue: {
      title: 'আজকের POS পারফরম্যান্স ও আয়',
      totalRevenue: 'আজকের মোট বিক্রি',
      totalOrders: 'আজকের মোট অর্ডার',
      avgOrder: 'গড় অর্ডার মূল্য',
      completedSales: 'সম্পন্ন বিক্রি',
      pendingSales: 'চলমান অর্ডার বিল',
      topDishes: 'আজকের সেরা বিক্রিত খাবার',
    },
  },
}

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    lang: localStorage.getItem('pos_language') || 'en',
  }),
  actions: {
    setLang(l) {
      this.lang = l === 'bn' ? 'bn' : 'en'
      localStorage.setItem('pos_language', this.lang)
    },
    toggle() {
      this.setLang(this.lang === 'en' ? 'bn' : 'en')
    },
    t(path, vars = {}) {
      const keys = path.split('.')
      let cur = translations[this.lang] || translations.en
      for (const k of keys) {
        if (!cur || cur[k] === undefined) {
          // fallback to en
          cur = null
          break
        }
        cur = cur[k]
      }
      if (!cur) {
        let fb = translations.en
        for (const k of keys) {
          if (!fb || fb[k] === undefined) return path
          fb = fb[k]
        }
        cur = fb
      }
      if (typeof cur === 'string') {
        let str = cur
        for (const [key, val] of Object.entries(vars)) {
          str = str.replace(new RegExp(`\\{${key}\\}`, 'g'), String(val))
        }
        return str
      }
      return cur || path
    },
    getItemName(item) {
      if (!item) return ''
      if (this.lang === 'bn' && item.nameBn) return item.nameBn
      return item.name
    },
    getItemCategory(item) {
      if (!item) return ''
      if (this.lang === 'bn' && item.categoryBn) return item.categoryBn
      return item.category
    },
  },
})
