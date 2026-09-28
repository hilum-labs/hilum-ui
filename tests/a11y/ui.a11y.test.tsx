/**
 * Accessibility smoke tests for key @hilum/ui components.
 *
 * Each case renders a realistic, correctly-labelled usage (the way the catalog
 * documents it) and runs axe-core over `document.body` so Radix portals are
 * included. See tests/axe.ts for the rules that are disabled under happy-dom.
 *
 * A component that genuinely violates is marked `it.fails` with a note, so the
 * suite stays green but flips red once the component is fixed (then drop the
 * `.fails`).
 */
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "../axe";

import { Button } from "../../packages/ui/src/components/button";
import { Input } from "../../packages/ui/src/components/input";
import { Label } from "../../packages/ui/src/components/label";
import { Checkbox } from "../../packages/ui/src/components/checkbox";
import { Switch } from "../../packages/ui/src/components/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../packages/ui/src/components/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../packages/ui/src/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../packages/ui/src/components/dropdown-menu";
import { Tooltip } from "../../packages/ui/src/components/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../packages/ui/src/components/accordion";
import { RadioGroup, RadioGroupItem } from "../../packages/ui/src/components/radio-group";
import { Slider } from "../../packages/ui/src/components/slider";
import { Combobox } from "../../packages/ui/src/components/combobox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../packages/ui/src/components/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../packages/ui/src/components/breadcrumb";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../packages/ui/src/components/table";
import { Alert, AlertDescription, AlertTitle } from "../../packages/ui/src/components/alert";
import { Badge } from "../../packages/ui/src/components/badge";
import { Avatar, AvatarFallback } from "../../packages/ui/src/components/avatar";
import { Progress } from "../../packages/ui/src/components/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../packages/ui/src/components/card";

async function expectAccessible(ui: React.ReactElement) {
  render(ui);
  expect(await axe(document.body)).toHaveNoAxeViolations();
}

describe("a11y: @hilum/ui", () => {
  it("Button", async () => {
    await expectAccessible(
      <div>
        <Button>Save changes</Button>
        <Button variant="outline" size="icon" aria-label="Close">
          ×
        </Button>
      </div>,
    );
  });

  it("Input with label", async () => {
    await expectAccessible(
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>,
    );
  });

  it("Checkbox with label", async () => {
    await expectAccessible(
      <div>
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms</Label>
      </div>,
    );
  });

  it("Switch", async () => {
    await expectAccessible(<Switch label="Email notifications" />);
  });

  it("Tabs", async () => {
    await expectAccessible(
      <Tabs defaultValue="account">
        <TabsList aria-label="Settings">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account settings</TabsContent>
        <TabsContent value="billing">Billing settings</TabsContent>
      </Tabs>,
    );
  });

  it("Dialog (open)", async () => {
    await expectAccessible(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
          <Button>Delete</Button>
        </DialogContent>
      </Dialog>,
    );
  });

  it("DropdownMenu (open)", async () => {
    await expectAccessible(
      <DropdownMenu open>
        <DropdownMenuTrigger asChild>
          <Button>Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
  });

  it("Tooltip (open)", async () => {
    await expectAccessible(
      <Tooltip content="Copy to clipboard" forceOpen>
        <Button aria-label="Copy">⧉</Button>
      </Tooltip>,
    );
  });

  it("Accordion", async () => {
    await expectAccessible(
      <Accordion type="single" collapsible defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>What is Hilum?</AccordionTrigger>
          <AccordionContent>A design system.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Is it free?</AccordionTrigger>
          <AccordionContent>Yes, MIT licensed.</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
  });

  it("RadioGroup", async () => {
    await expectAccessible(
      <RadioGroup defaultValue="monthly" aria-label="Billing period">
        <RadioGroupItem value="monthly" label="Monthly" />
        <RadioGroupItem value="yearly" label="Yearly" />
      </RadioGroup>,
    );
  });

  it("Slider", async () => {
    await expectAccessible(<Slider defaultValue={[40]} min={0} max={100} label="Volume" />);
  });

  it("Slider (range)", async () => {
    await expectAccessible(<Slider defaultValue={[20, 80]} min={0} max={100} label="Price" />);
  });

  it("Combobox", async () => {
    await expectAccessible(
      <Combobox
        aria-label="Fruit"
        options={[
          { value: "apple", label: "Apple" },
          { value: "banana", label: "Banana" },
        ]}
        placeholder="Pick a fruit"
      />,
    );
  });

  it("Pagination", async () => {
    await expectAccessible(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
  });

  it("Breadcrumb", async () => {
    await expectAccessible(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
  });

  it("Table", async () => {
    await expectAccessible(
      <Table>
        <TableCaption>Recent invoices</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>INV-001</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
  });

  it("Alert", async () => {
    await expectAccessible(
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Your trial ends in 3 days.</AlertDescription>
      </Alert>,
    );
  });

  it("Badge", async () => {
    await expectAccessible(<Badge>New</Badge>);
  });

  it("Avatar", async () => {
    await expectAccessible(
      <Avatar>
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>,
    );
  });

  it("Progress", async () => {
    await expectAccessible(<Progress value={60} aria-label="Upload progress" />);
  });

  it("Card", async () => {
    await expectAccessible(
      <Card>
        <CardHeader>
          <CardTitle>Plan</CardTitle>
          <CardDescription>Your current subscription.</CardDescription>
        </CardHeader>
        <CardContent>Pro — $20/month</CardContent>
      </Card>,
    );
  });
});
