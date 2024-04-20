import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type ColorLabelType = 'neutral' | 'gray' | 'red' | 'green' | 'yellow' | 'indigo' | 'purple' | 'pink';

@Component({
  selector: 'color-label',
  template: `
    <span [ngClass]="[color, size]">
      <ng-content></ng-content>
    </span>
  `,
  styles: [
    `
      .neutral {
        @apply bg-neutral-100 text-neutral-800 font-medium px-2.5 py-0.5 rounded dark:bg-neutral-900 dark:text-neutral-300;
      }

      .gray {
        @apply bg-gray-100 text-gray-800 font-medium px-2.5 py-0.5 rounded dark:bg-gray-900 dark:text-gray-300;
      }

      .red {
        @apply bg-red-100 text-red-800 font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300;
      }

      .green {
        @apply bg-green-100 text-green-800 font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300;
      }

      .yellow {
        @apply bg-yellow-100 text-yellow-800 font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300;
      }

      .indigo {
        @apply bg-indigo-100 text-indigo-800 font-medium px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300;
      }

      .purple {
        @apply bg-purple-100 text-purple-800 font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300;
      }

      .pink {
        @apply bg-pink-100 text-pink-800 font-medium px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300;
      }

      .xs {
        @apply text-xs;
      }

      .sm {
        @apply text-sm;
      }

      .normal {
        @apply text-base;
      }
    `,
  ],
  standalone: true,
  imports: [NgClass],
})
export default class ColorLabelComponent {
  @Input() color: ColorLabelType = 'neutral';

  @Input() size: 'normal' | 'sm' | 'xs' = 'normal';
}
