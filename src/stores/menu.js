import { defineStore } from 'pinia'
import { uid } from '@/utils/ids'
import { round2 } from '@/utils/money'

export const DEFAULT_FOOD_IMG = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'

export const SAMPLE_ITEMS = [
  // KFC & CP Style Fried Chicken & Set Menus (Requirement 2)
  {
    name: 'KFC Style Crispy Chicken (2 Pcs Combo)',
    nameBn: 'কেএফসি স্টাইল ক্রিস্পি চিকেন কম্বো (২ পিস)',
    category: 'Set Menu',
    categoryBn: 'সেট মেনু',
    price: 330,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'CP Style Spicy Fried Chicken (4 Pcs)',
    nameBn: 'সিপি স্টাইল স্পাইসি ফ্রাইড চিকেন (৪ পিস)',
    category: 'Fried Chicken',
    categoryBn: 'ফ্রাইড চিকেন',
    price: 420,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Zinger Burger Meal Set Menu',
    nameBn: 'জিঙ্গার বার্গার মিল সেট মেনু',
    category: 'Set Menu',
    categoryBn: 'সেট মেনু',
    price: 390,
    image: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Crispy Chicken Tenders (4 Pcs)',
    nameBn: 'ক্রিস্পি চিকেন স্ট্রিপস/টেন্ডার (৪ পিস)',
    category: 'Fried Chicken',
    categoryBn: 'ফ্রাইড চিকেন',
    price: 240,
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Family Feast Chicken Bucket (8 Pcs)',
    nameBn: 'ফ্যামিলি ফিস্ট চিকেন বাকেট (৮ পিস)',
    category: 'Set Menu',
    categoryBn: 'সেট মেনু',
    price: 890,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&auto=format&fit=crop&q=80',
  },

  // Soft Drinks & Cold Beverages (Requirement 4)
  {
    name: 'Fanta Orange (Can 250ml)',
    nameBn: 'ফ্যান্টা অরেঞ্জ (ক্যান ২৫০ মিলি)',
    category: 'Drinks',
    categoryBn: 'পানীয়',
    price: 60,
    image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Mirinda Orange (Can 250ml)',
    nameBn: 'মিরিন্ডা অরেঞ্জ (ক্যান ২৫০ মিলি)',
    category: 'Drinks',
    categoryBn: 'পানীয়',
    price: 60,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sprite Lemon-Lime (Can 250ml)',
    nameBn: 'স্প্রাইট লাইম (ক্যান ২৫০ মিলি)',
    category: 'Drinks',
    categoryBn: 'পানীয়',
    price: 60,
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Coca-Cola Classic (Can 250ml)',
    nameBn: 'কোকাকোলা ক্লাসিক (ক্যান ২৫০ মিলি)',
    category: 'Drinks',
    categoryBn: 'পানীয়',
    price: 60,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Traditional Shahi Borhani',
    nameBn: 'ঐতিহ্যবাহী শাহী বোরহানি',
    category: 'Drinks',
    categoryBn: 'পানীয়',
    price: 90,
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Creamy Iced Cold Coffee',
    nameBn: 'কোল্ড কফি উইথ আইসক্রিম',
    category: 'Drinks',
    categoryBn: 'পানীয়',
    price: 190,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fresh Mint Lime Cooler',
    nameBn: 'ফ্রেশ পুদিনা লাইম কুলার',
    category: 'Drinks',
    categoryBn: 'পানীয়',
    price: 130,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80',
  },

  // Mains / Rice & Biryani
  {
    name: 'Special Chicken Biryani',
    nameBn: 'স্পেশাল চিকেন বিরিয়ানি',
    category: 'Mains',
    categoryBn: 'মেইন ডিশ',
    price: 360,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Mutton Kacchi Biryani',
    nameBn: 'মাটন কাচ্চি বিরিয়ানি',
    category: 'Mains',
    categoryBn: 'মেইন ডিশ',
    price: 490,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Chicken Fried Rice Bowl',
    nameBn: 'চিকেন ফ্রাইড রাইস বোল',
    category: 'Mains',
    categoryBn: 'মেইন ডিশ',
    price: 280,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Grilled Chicken Steak',
    nameBn: 'গ্রিলড চিকেন স্টেক',
    category: 'Mains',
    categoryBn: 'মেইন ডিশ',
    price: 440,
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=80',
  },

  // Burgers & Pizza
  {
    name: 'Double Beef Cheese Burger',
    nameBn: 'ডাবল বিফ চিজ বার্গার',
    category: 'Burgers',
    categoryBn: 'বার্গার',
    price: 380,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Crispy Smoky Chicken Burger',
    nameBn: 'ক্রিস্পি স্মোকি চিকেন বার্গার',
    category: 'Burgers',
    categoryBn: 'বার্গার',
    price: 320,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Margherita Cheese Pizza',
    nameBn: 'মার্গারিটা চিজ পিৎজা',
    category: 'Pizza',
    categoryBn: 'পিৎজা',
    price: 550,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Creamy White Sauce Pasta',
    nameBn: 'হোয়াইট সস পাস্তা',
    category: 'Pasta',
    categoryBn: 'পাস্তা',
    price: 340,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=80',
  },

  // Starters & Sides
  {
    name: 'Spicy BBQ Chicken Wings',
    nameBn: 'বারবিকিউ চিকেন উইংস',
    category: 'Starters',
    categoryBn: 'স্টার্টার',
    price: 260,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Crispy French Fries Basket',
    nameBn: 'ক্রিস্পি ফ্রেঞ্চ ফ্রাইজ',
    category: 'Starters',
    categoryBn: 'স্টার্টার',
    price: 150,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Golden Spring Rolls (4 pcs)',
    nameBn: 'গোল্ডেন স্প্রিং রোলস',
    category: 'Starters',
    categoryBn: 'স্টার্টার',
    price: 180,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
  },

  // Desserts
  {
    name: 'Hot Sizzling Brownie with Ice Cream',
    nameBn: 'সিজলিং চকোলেট ব্রাউনি',
    category: 'Desserts',
    categoryBn: 'ডেজার্ট',
    price: 240,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80',
  },
  {
    name: 'Traditional Royal Firni',
    nameBn: 'শাহী ফিরনি',
    category: 'Desserts',
    categoryBn: 'ডেজার্ট',
    price: 120,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80',
  },
]

export const DEFAULT_CATEGORIES = [
  'Set Menu',
  'Fried Chicken',
  'Mains',
  'Burgers',
  'Pizza',
  'Pasta',
  'Starters',
  'Drinks',
  'Desserts',
]

export const useMenuStore = defineStore('menu', {
  state: () => ({
    items: [],
  }),

  getters: {
    categories: (state) =>
      [...new Set([...DEFAULT_CATEGORIES, ...state.items.map((i) => i.category)])].sort((a, b) =>
        a.localeCompare(b),
      ),
    usedCategories: (state) =>
      [...new Set(state.items.map((i) => i.category))].sort((a, b) => a.localeCompare(b)),
  },

  actions: {
    add({ name, nameBn, category, categoryBn, price, image }) {
      const item = {
        id: uid(),
        name: name.trim(),
        nameBn: (nameBn || name).trim(),
        category: category.trim(),
        categoryBn: (categoryBn || category).trim(),
        price: round2(price),
        image: image || DEFAULT_FOOD_IMG,
        createdAt: new Date().toISOString(),
      }
      this.items.push(item)
      return item
    },

    update(id, { name, nameBn, category, categoryBn, price, image }) {
      const index = this.items.findIndex((i) => i.id === id)
      if (index === -1) return null
      this.items[index] = {
        ...this.items[index],
        name: name.trim(),
        nameBn: (nameBn || name).trim(),
        category: category.trim(),
        categoryBn: (categoryBn || category).trim(),
        price: round2(price),
        image: image || this.items[index].image || DEFAULT_FOOD_IMG,
      }
      return this.items[index]
    },

    remove(id) {
      this.items = this.items.filter((i) => i.id !== id)
    },

    addSamples() {
      SAMPLE_ITEMS.forEach((it) => this.add(it))
    },

    /**
     * Heal existing localStorage items:
     * - Replaces broken 404 images with verified 200 OK images
     * - Injects missing set menus and soft drinks if they are not yet in state
     */
    healAndSyncMenu() {
      // Fix broken URLs
      const URL_FIXES = {
        'photo-1576107232684-1279f3908594': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80',
        'photo-1621996346565-e3d5d6281691': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=80',
      }

      this.items.forEach((item) => {
        if (!item.image) {
          const match = SAMPLE_ITEMS.find((s) => s.name === item.name)
          item.image = match?.image || DEFAULT_FOOD_IMG
        } else {
          for (const [badPart, goodUrl] of Object.entries(URL_FIXES)) {
            if (item.image.includes(badPart)) {
              item.image = goodUrl
            }
          }
        }
      })

      // If missing the new KFC/CP set menus or soft drinks, merge them in cleanly
      SAMPLE_ITEMS.forEach((s) => {
        const exists = this.items.some((it) => it.name.toLowerCase() === s.name.toLowerCase())
        if (!exists) {
          this.add(s)
        }
      })
    },
  },

  persist: {
    key: 'items',
    paths: ['items'],
    afterRestore(ctx) {
      ctx.store.healAndSyncMenu()
    },
  },
})
