import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import ModalSimpleAlert from "@/components/application-ui/overlays/modal-simple-alert";
import modalSimpleAlertSource from "@/components/application-ui/overlays/modal-simple-alert?raw";
import ModalSimpleWithDismiss from "@/components/application-ui/overlays/modal-simple-with-dismiss";
import modalSimpleWithDismissSource from "@/components/application-ui/overlays/modal-simple-with-dismiss?raw";
import ModalWithGroundFooter from "@/components/application-ui/overlays/modal-with-ground-footer";
import modalWithGroundFooterSource from "@/components/application-ui/overlays/modal-with-ground-footer?raw";
import ModalCenteredSingleAction from "@/components/application-ui/overlays/modal-centered-single-action";
import modalCenteredSingleActionSource from "@/components/application-ui/overlays/modal-centered-single-action?raw";
import ModalCenteredWideButtons from "@/components/application-ui/overlays/modal-centered-wide-buttons";
import modalCenteredWideButtonsSource from "@/components/application-ui/overlays/modal-centered-wide-buttons?raw";
import NotificationSimple from "@/components/application-ui/overlays/notification-simple";
import notificationSimpleSource from "@/components/application-ui/overlays/notification-simple?raw";
import NotificationWithAvatar from "@/components/application-ui/overlays/notification-with-avatar";
import notificationWithAvatarSource from "@/components/application-ui/overlays/notification-with-avatar?raw";
import NotificationWithActions from "@/components/application-ui/overlays/notification-with-actions";
import notificationWithActionsSource from "@/components/application-ui/overlays/notification-with-actions?raw";
import NotificationCondensed from "@/components/application-ui/overlays/notification-condensed";
import notificationCondensedSource from "@/components/application-ui/overlays/notification-condensed?raw";
import NotificationWithSplitButtons from "@/components/application-ui/overlays/notification-with-split-buttons";
import notificationWithSplitButtonsSource from "@/components/application-ui/overlays/notification-with-split-buttons?raw";
import SlideOverEmpty from "@/components/application-ui/overlays/slide-over-empty";
import slideOverEmptySource from "@/components/application-ui/overlays/slide-over-empty?raw";
import SlideOverBrandedHeader from "@/components/application-ui/overlays/slide-over-branded-header";
import slideOverBrandedHeaderSource from "@/components/application-ui/overlays/slide-over-branded-header?raw";
import SlideOverUserProfile from "@/components/application-ui/overlays/slide-over-user-profile";
import slideOverUserProfileSource from "@/components/application-ui/overlays/slide-over-user-profile?raw";
import SlideOverCreateProjectForm from "@/components/application-ui/overlays/slide-over-create-project-form";
import slideOverCreateProjectFormSource from "@/components/application-ui/overlays/slide-over-create-project-form?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function OverlaysPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10 flex flex-col gap-6 border-b border-ground-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
            <a href="/" className="hover:text-ground-700">
              Design System
            </a>
            <span>/</span>
            <a href="/application-ui" className="hover:text-ground-700">
              Application UI
            </a>
            <span>/</span>
            <span className="font-semibold text-ground-900">Overlays</span>
          </div>
          <h1 className="display mb-2 text-ground-900">Overlays</h1>
          <p className="body max-w-2xl text-ground-400">
            Modals, notification toasts, and slide-over panels.
          </p>
          <p className="caption mt-5 text-ground-400">Overlay · 24 variants</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">Static previews</Badge>
          <Button size="sm">Create overlay</Button>
        </div>
      </div>

      <PageDocs path="/application-ui/overlays/" />

      <section className="mb-12">
        <SectionHeading label="Modals" />
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewBlock
            title="Simple Alert"
            description="A centered confirmation alert with primary and secondary actions."
            code={modalSimpleAlertSource}
            previewClassName="p-6"
          >
            <ModalSimpleAlert />
          </PreviewBlock>

          <PreviewBlock
            title="Simple With Dismiss Button"
            description="A concise information modal with a direct exit affordance."
            code={modalSimpleWithDismissSource}
            previewClassName="p-6"
          >
            <ModalSimpleWithDismiss />
          </PreviewBlock>

          <PreviewBlock
            title="With Ground Footer"
            description="A conventional modal body with actions anchored in a separated footer."
            code={modalWithGroundFooterSource}
            previewClassName="p-6"
          >
            <ModalWithGroundFooter />
          </PreviewBlock>

          <PreviewBlock
            title="Centered With Single Action"
            description="Success confirmation with one clear completion button."
            code={modalCenteredSingleActionSource}
            previewClassName="p-6"
          >
            <ModalCenteredSingleAction />
          </PreviewBlock>

          <PreviewBlock
            title="Centered With Wide Buttons"
            description="Stacked actions for mobile-friendly confirmation flows."
            code={modalCenteredWideButtonsSource}
            previewClassName="p-6"
          >
            <ModalCenteredWideButtons />
          </PreviewBlock>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeading label="Notifications" />
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewBlock
            title="Simple"
            description="A minimal toast with text and an inline dismiss button."
            code={notificationSimpleSource}
            previewClassName="p-6"
          >
            <NotificationSimple />
          </PreviewBlock>

          <PreviewBlock
            title="With Avatar"
            description="Identity-led toast content for collaboration events."
            code={notificationWithAvatarSource}
            previewClassName="p-6"
          >
            <NotificationWithAvatar />
          </PreviewBlock>

          <PreviewBlock
            title="With Actions Below"
            description="Useful when a toast needs a clear follow-up action."
            code={notificationWithActionsSource}
            previewClassName="p-6"
          >
            <NotificationWithActions />
          </PreviewBlock>

          <PreviewBlock
            title="Condensed"
            description="A dense, single-line notification for low-priority updates."
            code={notificationCondensedSource}
            previewClassName="p-6"
          >
            <NotificationCondensed />
          </PreviewBlock>

          <PreviewBlock
            title="With Split Buttons"
            description="Actions sit beside the message for quick decision making."
            code={notificationWithSplitButtonsSource}
            previewClassName="p-6"
          >
            <NotificationWithSplitButtons />
          </PreviewBlock>
        </div>
      </section>

      <section>
        <SectionHeading label="Slide-Overs" />
        <div className="grid gap-6">
          <PreviewBlock
            title="Empty"
            description="A clean side panel for empty states or first-run guidance."
            code={slideOverEmptySource}
            previewClassName="p-0"
          >
            <SlideOverEmpty />
          </PreviewBlock>

          <PreviewBlock
            title="With Branded Header"
            description="A more opinionated panel for high-visibility workflows."
            code={slideOverBrandedHeaderSource}
            previewClassName="p-0"
          >
            <SlideOverBrandedHeader />
          </PreviewBlock>

          <PreviewBlock
            title="User Profile"
            description="A profile summary with contact details and a single edit action."
            code={slideOverUserProfileSource}
            previewClassName="p-0"
          >
            <SlideOverUserProfile />
          </PreviewBlock>

          <PreviewBlock
            title="Create Project Form"
            description="A form-heavy panel with controlled inputs and team selection."
            code={slideOverCreateProjectFormSource}
            previewClassName="p-0"
          >
            <SlideOverCreateProjectForm />
          </PreviewBlock>
        </div>
      </section>

      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/application-ui/overlays/")({
  head: () => createCatalogPageHead("/application-ui/overlays/"),
  component: OverlaysPage,
});
