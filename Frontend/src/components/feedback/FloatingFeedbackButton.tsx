
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeedbackDialog from './FeedbackDialog';

const FloatingFeedbackButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <FeedbackDialog 
        trigger={
          <Button size="lg" className="rounded-full shadow-lg">
            <MessageSquare className="h-5 w-5 mr-2" />
            Gửi phản hồi
          </Button>
        } 
      />
    </div>
  );
};

export default FloatingFeedbackButton;
