import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
// PDF is now handled by window.print() — no external libraries needed

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit, OnDestroy {

  private readonly draftStorageKey = 'bni-gains-draft-v1';
  private autosaveTimer: ReturnType<typeof setTimeout> | null = null;

  theme: 'dark' | 'light' = 'dark';
  previewOpen = false;
  avatarUrl: string | null = null;

  form = {
    name: 'Alex Morgan',
    title: 'Senior Business Strategist · Morgan Advisory Group',
    tagline: 'Turning ambitious visions into measurable results — one relationship at a time.',
    chapter: 'Themis',
    year: '2019',
    email: 'alex@morganadvisory.com',
    phone: '+1 (555) 820-4491',
    website: 'morganadvisory.com',
    linkedin: 'linkedin.com/in/alexmorgan',
    goals: 'Expand my advisory practice into the healthcare and tech sectors by Q3. Build a mastermind group of 12 CEOs in the metro area. Publish my first book on scaling founder-led businesses by end of year.',
    goalsTags: 'Healthcare Expansion, Book Launch, CEO Mastermind',
    acc: 'Helped 3 clients achieve successful exits totaling $47M in combined valuation. Featured in Business Insider\'s "Top 40 Under 40." Grew my own firm from solo practice to a team of 11 in under 4 years.',
    accTags: '$47M Exit Portfolio, Top 40 Under 40, 11-Person Team',
    int: 'Avid trail runner — completed two ultramarathons. Passionate about jazz piano, urban architecture, and mentoring first-generation college students. Weekend farmer\'s market regular.',
    intTags: 'Trail Running, Jazz Piano, Mentoring, Architecture',
    net: 'Active member of EO (Entrepreneurs\' Organization), Forbes Coaches Council, and the local Chamber of Commerce board. Strong ties to the legal, real estate, financial services, and startup ecosystems.',
    netTags: 'EO Member, Forbes Council, Chamber Board',
    skills: 'Strategic planning & business model design · Executive coaching & leadership development · M&A preparation and investor readiness · Revenue growth frameworks · Team building and organizational design · Public speaking & keynotes',
    skillsTags: 'Strategic Planning, Executive Coaching, M&A Readiness, Revenue Growth, Public Speaking',
  };

  ngOnInit(): void {
    this.restoreDraft();
  }

  ngOnDestroy(): void {
    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer);
      this.autosaveTimer = null;
    }
  }

  get initials(): string {
    const parts = this.form.name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return (parts[0]?.[0] || '?').toUpperCase();
  }

  tags(value: string) {
    return value.split(',').map((tag) => tag.trim()).filter(Boolean);
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', this.theme === 'dark');
    this.queueAutosave();
  }

  toggleMobilePreview() {
    this.previewOpen = !this.previewOpen;
  }

  closeMobilePreview() {
    this.previewOpen = false;
  }

  queueAutosave(): void {
    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer);
    }

    // Debounce frequent keypresses before writing to localStorage.
    this.autosaveTimer = setTimeout(() => {
      this.saveDraft();
      this.autosaveTimer = null;
    }, 300);
  }

  private saveDraft(): void {
    const payload = {
      theme: this.theme,
      avatarUrl: this.avatarUrl,
      form: this.form
    };

    try {
      localStorage.setItem(this.draftStorageKey, JSON.stringify(payload));
    } catch (error) {
      console.warn('Could not save draft to localStorage:', error);
    }
  }

  private restoreDraft(): void {
    try {
      const raw = localStorage.getItem(this.draftStorageKey);
      if (!raw) {
        document.documentElement.classList.toggle('dark', this.theme === 'dark');
        return;
      }

      const parsed = JSON.parse(raw) as {
        theme?: 'dark' | 'light';
        avatarUrl?: string | null;
        form?: Record<string, unknown>;
      };

      if (parsed.form) {
        this.form = {
          ...this.form,
          ...parsed.form
        };
      }

      if (parsed.theme === 'dark' || parsed.theme === 'light') {
        this.theme = parsed.theme;
      }

      if (typeof parsed.avatarUrl === 'string' || parsed.avatarUrl === null) {
        this.avatarUrl = parsed.avatarUrl;
      }
    } catch (error) {
      console.warn('Could not restore draft from localStorage:', error);
    } finally {
      document.documentElement.classList.toggle('dark', this.theme === 'dark');
    }
  }

  downloadPDF(): void {
    window.print();
  }


  handlePhoto(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      this.avatarUrl = e.target?.result as string;
      this.queueAutosave();
    };
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.avatarUrl = null;
    this.queueAutosave();
  }
}
