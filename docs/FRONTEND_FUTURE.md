# Frontend Future

Things we didn't get to during the beautification pass. Organized by priority.

---

## Should

Features that would meaningfully improve UX.

- **Empty states** -- friendly messages when there are no groups/expenses/settlements yet, with a call-to-action button (e.g. "No expenses yet. Add one!")
- **Confirmation dialogs** -- replace `window.confirm` for delete actions with shadcn `AlertDialog` (`npx shadcn@latest add alert-dialog`)
- **Toast notifications** -- Sonner is installed and used for copy-invite-link, but not wired up to mutations. Show success/error toasts on create/edit/delete actions
- **Mobile responsiveness** -- test and fix layouts on small screens using Tailwind's `sm:`/`md:`/`lg:` prefixes
- **Landing page** -- the homepage is bare minimum centered text + buttons. Could be a proper hero/marketing page

## Could

Nice polish that isn't urgent.

- **Loading spinners on buttons** -- replace "Submitting..." text with an animated `Loader2` icon from lucide-react (`animate-spin`) during mutations
- **Skeleton loading** -- replace "Loading..." text with pulsing placeholder blocks shaped like the content about to load (`npx shadcn@latest add skeleton`). Looks polished but requires manually matching each page's layout
- **Dark mode toggle** -- CSS variables for `.dark` are already defined, just need a toggle button (next-themes is installed)
- **Convert JoinGroupPage native select** -- the claim-member `<select>` is still a native element, could be swapped to shadcn Select + Controller for consistency

## Maybe

Bigger refactors that add correctness/accessibility but are a lot of work.

- **shadcn Form integration** -- use the native react-hook-form + shadcn integration (`Field`, `FieldLabel`, `FieldError`, `Controller`) for consistent error display, red border outlines, and `aria-invalid` accessibility attributes. See `form-error.tsx` comment. Would require rewriting every form field across all pages
