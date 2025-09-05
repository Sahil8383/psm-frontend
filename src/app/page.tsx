"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PropertiesList } from "@/components/properties/properties-list";

export default function HomePage() {
  return (
    <MainLayout>
      <section className="container mx-auto px-4 py-8">
        <PropertiesList />
      </section>
    </MainLayout>
  );
}
