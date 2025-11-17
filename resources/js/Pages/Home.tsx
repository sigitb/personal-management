import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AppLayout from "@/Layouts/AppLayout";

export default function Home() {

  return (
    <AppLayout>
      <>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Laravel + Inertia + React + TS + Tailwind + shadcn/ui</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button>Get Started</Button>
          </CardContent>
        </Card>
      </>
    </AppLayout>
  );
}
