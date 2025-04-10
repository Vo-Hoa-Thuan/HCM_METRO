
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import FeedbackForm from './FeedbackForm';

type FeedbackDialogProps = {
  trigger?: React.ReactNode;
};

const FeedbackDialog = ({ trigger }: FeedbackDialogProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>Phản hồi</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Phản hồi</DialogTitle>
          <DialogDescription>
            Ý kiến của bạn sẽ giúp chúng tôi cải thiện dịch vụ Metro
          </DialogDescription>
        </DialogHeader>
        <FeedbackForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
