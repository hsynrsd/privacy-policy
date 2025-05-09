import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

type Section = {
  name: string;
  id: string;
  description: string;
};

type SectionStatus = Section & {
  completed: boolean;
  current: boolean;
};

export function FormCompletionStatus({ sections }: { sections: SectionStatus[] }) {
  const completedSections = sections.filter(section => section.completed);
  const totalSections = sections.length;
  const progress = Math.round((completedSections.length / totalSections) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Completion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full">
              <div 
                className="h-2 bg-primary rounded-full transition-all" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            {sections.map(section => (
              <div key={section.id} className="flex items-center justify-between">
                <span className="text-sm">{section.name}</span>
                {section.completed && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 