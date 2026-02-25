"use client"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from './ui/dialog'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PricingSection from './PricingSection'

const PricingModal = ({
  subscriptionTier = "free",
  children,
  onClose,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // only allow the modal to open for free users; pro users can't change
  const canOpen = subscriptionTier === "free";

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      // user just closed the pricing drawer – they may have upgraded or
      // downgraded. refresh server components (header, layouts) and invoke
      // any callback passed by the parent so pages can reload their data.
      router.refresh();
      if (onClose) onClose();
      // also broadcast an event so other components (e.g. recipe page)
      // can react even if they didn't pass an explicit callback.
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("pricingModalClosed"));
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={canOpen ? handleOpenChange : undefined}
    >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="p-8 pt-4 sm:max-w-6xl">
        <DialogTitle />
        <PricingSection />
      </DialogContent>
    </Dialog>
  );
};
export default PricingModal