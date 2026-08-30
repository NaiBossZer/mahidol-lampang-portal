import React, { useState } from 'react';
import { useCart } from './CartContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const CheckoutModal = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void 
}) => {
  const { items, totalPrice, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Info, 2: Payment, 3: Success

  const deliveryFee = deliveryMethod === 'delivery' ? 50 : 0;
  const finalTotal = totalPrice + deliveryFee;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleMockUpload = () => {
    toast.success('อัปโหลดสลิปสำเร็จ');
    setStep(3);
    setTimeout(() => {
      clearCart();
      onClose();
      setStep(1);
    }, 3000);
  };

  if (items.length === 0 && step === 1) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#002D62]">
            {step === 1 ? 'ข้อมูลจัดส่ง' : step === 2 ? 'ชำระเงิน' : 'สำเร็จ'}
          </DialogTitle>
          <DialogDescription>
            {step === 1 ? 'กรุณากรอกข้อมูลสำหรับการรับสินค้า' : step === 2 ? 'สแกน QR Code เพื่อชำระเงิน' : 'ได้รับคำสั่งซื้อของคุณแล้ว'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4">
            <div className="space-y-2">
              <Label>ตัวเลือกการรับสินค้า</Label>
              <RadioGroup 
                value={deliveryMethod} 
                onValueChange={(val) => setDeliveryMethod(val as 'pickup' | 'delivery')}
                className="flex flex-col space-y-2 mt-2"
              >
                <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup" className="cursor-pointer flex-1">รับด้วยตนเองที่ศูนย์วิจัยลำปาง (ฟรี)</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="cursor-pointer flex-1">จัดส่งด่วนในพื้นที่ (+฿50)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                <Input id="name" required placeholder="สมชาย ใจดี" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input id="phone" required placeholder="08x-xxx-xxxx" />
              </div>
            </div>

            {deliveryMethod === 'delivery' && (
              <div className="space-y-2">
                <Label htmlFor="address">ที่อยู่จัดส่ง / จุดนัดรับ</Label>
                <Textarea id="address" required placeholder="บ้านเลขที่, ถนน, ตำบล..." />
              </div>
            </div>
            )}

            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>ค่าสินค้า</span>
                <span>฿{totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>ค่าจัดส่ง</span>
                <span>฿{deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-[#2E7D32]">
                <span>ยอดสุทธิ</span>
                <span>฿{finalTotal}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>ยกเลิก</Button>
              <Button type="submit" className="bg-[#002D62] hover:bg-[#002D62]/90 text-white">ดำเนินการชำระเงิน</Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center space-y-6 py-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">ยอดชำระทั้งหมด</p>
              <p className="text-3xl font-bold text-[#2E7D32]">฿{finalTotal}</p>
            </div>
            
            <div className="bg-gray-100 w-48 h-48 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-400">
                <p className="font-semibold mb-1">PromptPay QR</p>
                <p className="text-xs">(Mockup Component)</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 text-center">
              * ฟีเจอร์นี้เตรียมไว้รองรับระบบ Payment Gateway (Cross System) ในอนาคต
            </p>

            <div className="w-full space-y-3 pt-4 border-t">
              <Button 
                variant="outline" 
                className="w-full h-24 border-dashed"
                onClick={handleMockUpload}
              >
                <div className="flex flex-col items-center gap-2">
                  <UploadCloud className="w-6 h-6 text-gray-400" />
                  <span>คลิกเพื่ออัปโหลดสลิปจำลอง</span>
                </div>
              </Button>
            </div>
            
            <div className="flex w-full justify-between mt-4">
              <Button variant="ghost" onClick={() => setStep(1)}>ย้อนกลับ</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <CheckCircle className="w-16 h-16 text-[#2E7D32]" />
            <h3 className="text-xl font-semibold text-[#002D62]">สั่งซื้อสำเร็จ!</h3>
            <p className="text-gray-500 text-center">
              ขอบคุณที่สนับสนุนผลผลิตจากศูนย์วิจัยฯ<br/>
              เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยันการจัดส่ง
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
