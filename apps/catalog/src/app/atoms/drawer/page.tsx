import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@hilum/ui";
import { Button } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { Trash2 } from "lucide-react";

const CODE = {
  basic: `import {
  Drawer, DrawerTrigger, DrawerContent,
  DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose,
} from "@hilum/ui"
import { Button } from "@hilum/ui"

<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">Open Drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Edit profile</DrawerTitle>
      <DrawerDescription>Update your name and bio.</DrawerDescription>
    </DrawerHeader>
    <div className="flex flex-col gap-4 px-6 pb-2">
      <div>
        <p className="label text-ground-500 mb-1.5">Name</p>
        <div className="h-10 rounded-md border border-ground-200 bg-white px-3 flex items-center">
          <span className="body text-ground-300">Your full name</span>
        </div>
      </div>
      <div>
        <p className="label text-ground-500 mb-1.5">Bio</p>
        <div className="h-20 rounded-md border border-ground-200 bg-white px-3 py-2">
          <span className="body text-ground-300">Tell us about yourself</span>
        </div>
      </div>
    </div>
    <DrawerFooter className="flex-row justify-end gap-2">
      <DrawerClose asChild>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
      <Button>Save</Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`,

  confirm: `import {
  Drawer, DrawerTrigger, DrawerContent,
  DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose,
} from "@hilum/ui"
import { Button } from "@hilum/ui"
import { Trash2 } from "lucide-react"

<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">Delete item</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader className="items-center sm:items-start">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <Trash2 size={22} className="text-red-600" />
      </div>
      <DrawerTitle>Delete this item?</DrawerTitle>
      <DrawerDescription>
        This action is permanent and cannot be undone. The item will be
        removed from your account immediately.
      </DrawerDescription>
    </DrawerHeader>
    <DrawerFooter className="flex-row gap-2">
      <DrawerClose asChild>
        <Button variant="outline" className="flex-1">Cancel</Button>
      </DrawerClose>
      <button className="flex-1 bg-red-600 text-white rounded-md px-4 py-2 body font-medium hover:bg-red-700 transition-colors">
        Delete
      </button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`,

  cart: `import {
  Drawer, DrawerTrigger, DrawerContent,
  DrawerHeader, DrawerFooter, DrawerTitle, DrawerClose,
} from "@hilum/ui"
import { Button } from "@hilum/ui"

const cartItems = [
  { name: "Linen shirt — Sand", price: "$89", qty: 1 },
  { name: "Merino crewneck — Navy", price: "$120", qty: 2 },
  { name: "Canvas tote bag", price: "$45", qty: 1 },
]

<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">View cart (3)</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Your cart</DrawerTitle>
    </DrawerHeader>
    <div className="flex flex-col px-6">
      {cartItems.map((item) => (
        <div key={item.name} className="flex items-center justify-between border-b border-ground-100 py-3">
          <div>
            <p className="body font-medium text-ground-900">{item.name}</p>
            <p className="caption text-ground-400">Qty: {item.qty}</p>
          </div>
          <p className="body font-medium text-ground-900">{item.price}</p>
        </div>
      ))}
    </div>
    <DrawerFooter>
      <div className="flex items-center justify-between mb-3">
        <p className="body text-ground-500">Subtotal</p>
        <p className="body font-semibold text-ground-900">$374.00</p>
      </div>
      <button className="w-full bg-brand-primary text-white rounded-md px-4 py-2.5 body font-medium hover:bg-brand-primary/90 transition-colors">
        Checkout
      </button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`,
};

const cartItems = [
  { name: "Linen shirt — Sand", price: "$89", qty: 1 },
  { name: "Merino crewneck — Navy", price: "$120", qty: 2 },
  { name: "Canvas tote bag", price: "$45", qty: 1 },
];

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function DrawerPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Drawer</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Drawer</h1>
        <p className="body max-w-lg text-ground-500">
          Bottom sheet panel that slides up from the screen edge — ideal for
          mobile-first interactions and contextual actions.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Variants" />

        <PreviewBlock
          title="Basic drawer"
          description="Form fields with cancel and save actions"
          code={CODE.basic}
        >
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Edit profile</DrawerTitle>
                <DrawerDescription>Update your name and bio.</DrawerDescription>
              </DrawerHeader>
              <div className="flex flex-col gap-4 px-6 pb-2">
                <div>
                  <p className="label text-ground-500 mb-1.5">Name</p>
                  <div className="h-10 rounded-md border border-ground-200 bg-white px-3 flex items-center">
                    <span className="body text-ground-300">Your full name</span>
                  </div>
                </div>
                <div>
                  <p className="label text-ground-500 mb-1.5">Bio</p>
                  <div className="h-20 rounded-md border border-ground-200 bg-white px-3 py-2">
                    <span className="body text-ground-300">Tell us about yourself</span>
                  </div>
                </div>
              </div>
              <DrawerFooter className="flex-row justify-end gap-2">
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
                <Button>Save</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </PreviewBlock>

        <PreviewBlock
          title="Confirmation drawer"
          description="Destructive action with a warning icon and clear consequence messaging"
          code={CODE.confirm}
        >
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Delete item</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="items-center sm:items-start">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                  <Trash2 size={22} className="text-red-600" />
                </div>
                <DrawerTitle>Delete this item?</DrawerTitle>
                <DrawerDescription>
                  This action is permanent and cannot be undone. The item will be
                  removed from your account immediately.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter className="flex-row gap-2">
                <DrawerClose asChild>
                  <Button variant="outline" className="flex-1">Cancel</Button>
                </DrawerClose>
                <button className="flex-1 bg-red-600 text-white rounded-md px-4 py-2 body font-medium hover:bg-red-700 transition-colors">
                  Delete
                </button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </PreviewBlock>

        <PreviewBlock
          title="Shopping cart drawer"
          description="Line items with subtotal and a full-width checkout CTA"
          code={CODE.cart}
        >
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">View cart (3)</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Your cart</DrawerTitle>
              </DrawerHeader>
              <div className="flex flex-col px-6">
                {cartItems.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between border-b border-ground-100 py-3"
                  >
                    <div>
                      <p className="body font-medium text-ground-900">{item.name}</p>
                      <p className="caption text-ground-400">Qty: {item.qty}</p>
                    </div>
                    <p className="body font-medium text-ground-900">{item.price}</p>
                  </div>
                ))}
              </div>
              <DrawerFooter>
                <div className="flex items-center justify-between mb-3">
                  <p className="body text-ground-500">Subtotal</p>
                  <p className="body font-semibold text-ground-900">$374.00</p>
                </div>
                <button className="w-full bg-brand-primary text-white rounded-md px-4 py-2.5 body font-medium hover:bg-brand-primary/90 transition-colors">
                  Checkout
                </button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/drawer/")({
  head: () => createCatalogPageHead("/atoms/drawer/"),
  component: DrawerPage,
});
