/* ═══════════════════════════════════════════
   PHANTOM AI — Core Application Logic
   ═══════════════════════════════════════════ */

const Phantom = {
  // ── State ──
  user: null,
  toastTimeout: null,
  // Base path — change this if deploying to a subdirectory
  basePath: (function() {
    const base = document.querySelector('base');
    if (base) return base.getAttribute('href').replace(/\/$/, '');
    // Auto-detect from script src
    const scripts = document.querySelectorAll('script[src*="app.js"]');
    if (scripts.length) {
      const src = scripts[0].getAttribute('src');
      const idx = src.indexOf('js/app.js');
      if (idx > 0) return src.substring(0, idx - 1);
    }
    return '';
  })(),

  url(path) {
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) path = path.substring(1);
    return this.basePath + '/' + path;
  },

  navigate(path) {
    window.location.href = this.url(path);
  },

  // ── Init ──
  init() {
    this.user = this.getUser();
    this.initNav();
    this.initScrollReveal();
    this.protectRoutes();
  },

  // ── Auth ──
  getUser() {
    try { return JSON.parse(localStorage.getItem('phantom_user')); }
    catch { return null; }
  },

  setUser(user) {
    this.user = user;
    localStorage.setItem('phantom_user', JSON.stringify(user));
  },

  logout() {
    this.user = null;
    localStorage.removeItem('phantom_user');
    this.navigate('index.html');
  },

  signup(name, email, password) {
    if (!name || !email || !password) {
      this.toast('Please fill in all fields', 'error');
      return false;
    }
    if (password.length < 8) {
      this.toast('Password must be at least 8 characters', 'error');
      return false;
    }
    // Simulated signup — replace with real API
    const user = {
      id: 'usr_' + Math.random().toString(36).slice(2, 10),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      plan: 'starter',
      createdAt: new Date().toISOString(),
      avatar: null,
      settings: {
        emailTwin: true,
        billNegotiator: false,
        opportunityHunter: false,
        autoApprove: false,
        morningBrief: true,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
      },
      stats: {
        emailsHandled: 0,
        moneySaved: 0,
        hoursReclaimed: 0,
        tasksCompleted: 0
      }
    };
    this.setUser(user);
    return true;
  },

  login(email, password) {
    if (!email || !password) {
      this.toast('Please fill in all fields', 'error');
      return false;
    }
    // Simulated login — replace with real API
    const existing = this.getUser();
    if (existing && existing.email === email.trim().toLowerCase()) {
      this.user = existing;
      return true;
    }
    // Demo: create user on login if not exists
    const user = {
      id: 'usr_' + Math.random().toString(36).slice(2, 10),
      name: email.split('@')[0],
      email: email.trim().toLowerCase(),
      plan: 'pro',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      avatar: null,
      settings: {
        emailTwin: true,
        billNegotiator: true,
        opportunityHunter: false,
        autoApprove: false,
        morningBrief: true,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
      },
      stats: {
        emailsHandled: 247,
        moneySaved: 482.30,
        hoursReclaimed: 34,
        tasksCompleted: 89
      }
    };
    this.setUser(user);
    return true;
  },

  protectRoutes() {
    const current = window.location.pathname;
    const isProtected = current.endsWith('dashboard.html') || current.endsWith('settings.html');
    if (isProtected && !this.user) {
      this.navigate('login.html');
    }
  },

  // ── Navigation ──
  initNav() {
    const toggle = document.querySelector('.nav-mobile-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => links.classList.toggle('open'));
      // Close on link click
      links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => links.classList.remove('open'));
      });
    }
  },

  // ── Scroll Reveal ──
  initScrollReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`;
      observer.observe(el);
    });
  },

  // ── Toast Notifications ──
  toast(message, type = 'info', duration = 4000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // ── Waitlist ──
  joinWaitlist(email) {
    if (!email || !email.includes('@')) {
      this.toast('Please enter a valid email', 'error');
      return false;
    }
    const waitlist = JSON.parse(localStorage.getItem('phantom_waitlist') || '[]');
    if (waitlist.includes(email)) {
      this.toast("You're already on the list! 💜", 'info');
      return false;
    }
    waitlist.push(email);
    localStorage.setItem('phantom_waitlist', JSON.stringify(waitlist));
    this.toast("You're in! We'll reach out soon.", 'success');
    return waitlist.length;
  },

  // ── Dashboard Data (simulated) ──
  getDashboardData() {
    const user = this.user;
    if (!user) return null;

    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return {
      greeting: `${greeting}, ${user.name.split(' ')[0]}`,
      stats: user.stats,
      plan: user.plan,
      recentActivity: [
        { icon: '📧', label: 'Replied to meeting invite from Alex Chen', detail: 'Accepted — added to calendar', time: '8 min ago', type: 'email' },
        { icon: '💰', label: 'Negotiated Comcast bill down', detail: 'Saved $34/mo ($408/year)', time: '1 hour ago', type: 'money' },
        { icon: '📅', label: 'Rescheduled dentist appointment', detail: 'Moved to Thursday 3:00 PM', time: '2 hours ago', type: 'calendar' },
        { icon: '🛡️', label: 'Disputed duplicate charge', detail: '$47.00 refund initiated — Chase Visa ****4829', time: '3 hours ago', type: 'money' },
        { icon: '✈️', label: 'Found cheap flight to Tokyo', detail: '$389 round-trip (52% below alert) — held 24h', time: '5 hours ago', type: 'deal' },
        { icon: '📝', label: 'Applied to 3 freelance projects', detail: 'Personalized cover letters sent via Upwork', time: '6 hours ago', type: 'job' },
        { icon: '📧', label: 'Declined 2 promotional meetings', detail: 'Politely passed — not relevant to Q1 goals', time: '7 hours ago', type: 'email' },
        { icon: '🔔', label: 'Insurance renewal reminder', detail: 'Policy expires Mar 28 — found 15% cheaper option', time: '8 hours ago', type: 'alert' },
      ],
      pendingApprovals: [
        { id: 'apr_1', icon: '📧', title: 'Reply to Sarah (re: Project Deadline)', preview: '"Hi Sarah, I\'ve reviewed the timeline and I think we can hit the March 20th deadline if we..."', action: 'approve_email' },
        { id: 'apr_2', icon: '💰', title: 'Switch electric provider', preview: 'Found Green Energy Co. at $0.11/kWh vs your current $0.14/kWh. Saves ~$28/mo.', action: 'approve_switch' },
        { id: 'apr_3', icon: '✈️', title: 'Book Tokyo flight', preview: 'JAL round-trip Mar 25-Apr 2, $389. Price expires in 22h.', action: 'approve_booking' },
      ],
      weeklyChart: [32, 18, 45, 28, 52, 38, 41],
      weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    };
  },

  // ── Simulated Approval ──
  approve(id) {
    this.toast('Approved! Phantom is on it.', 'success');
    const el = document.querySelector(`[data-approval-id="${id}"]`);
    if (el) {
      el.style.opacity = '0.4';
      el.style.pointerEvents = 'none';
      el.querySelector('.approval-actions').innerHTML = '<span class="badge badge-green">✓ Approved</span>';
    }
  },

  dismiss(id) {
    this.toast('Dismissed.', 'info');
    const el = document.querySelector(`[data-approval-id="${id}"]`);
    if (el) {
      el.style.opacity = '0';
      el.style.height = '0';
      el.style.padding = '0';
      el.style.margin = '0';
      el.style.overflow = 'hidden';
      el.style.transition = 'all 0.3s ease';
    }
  },

  // ── Settings Save ──
  saveSetting(key, value) {
    if (!this.user) return;
    this.user.settings[key] = value;
    this.setUser(this.user);
    this.toast('Setting saved', 'success', 2000);
  },

  updateProfile(name, email) {
    if (!this.user) return;
    if (name) this.user.name = name.trim();
    if (email) this.user.email = email.trim().toLowerCase();
    this.setUser(this.user);
    this.toast('Profile updated', 'success');
  },
};

// ── Revealed class for scroll animation ──
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);
  Phantom.init();
});
