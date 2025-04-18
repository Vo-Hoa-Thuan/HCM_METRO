
import React, { useEffect, useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { submitFeedback } from '@/api/feedbackApi';
import { getUserById} from "@/api/userApi";


type FeedbackFormProps = {
  onClose?: () => void;
  source?: string;
};

const defaultSource = typeof window !== 'undefined' ? 'website' : 'app';


const FeedbackForm = ({ onClose, source = defaultSource }: FeedbackFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  
  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const userData = await getUserById(userId);
        setUser(userData);
      }
    };
  
    fetchUser();
  }, []);
  

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Vui lòng chọn đánh giá",
        description: "Bạn cần chọn số sao đánh giá trước khi gửi",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit feedback to API
      await submitFeedback({
        rating,
        comment: feedback,
        source,
        userId: user?.id,
        userName: user?.name || "Ẩn danh",
      });
      
      toast({
        title: "Cảm ơn bạn đã gửi đánh giá!",
        description: "Phản hồi của bạn giúp chúng tôi cải thiện dịch vụ tốt hơn.",
        className: "bg-success text-white",
      });
      
      // Reset form
      setRating(0);
      setFeedback('');
      
      // Close modal if provided
      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast({
        title: "Không thể gửi đánh giá",
        description: "Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-center">Đánh giá dịch vụ</CardTitle>
          <CardDescription className="text-center">
            Hãy cho chúng tôi biết trải nghiệm của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRatingClick(value)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    value <= rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          <div className="pt-4">
            <Textarea
              placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ Metro (tùy chọn)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};


export default FeedbackForm;
