import { ModeToggle } from '@/components/mode-toggle';
import logo from '@/assets/logo.png'
import { Separator } from '@/components/ui/separator';
import { ProfileButton } from '@/components/profile-button';

export const Header = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <img src={logo} className='w-28 md:w-44' />
      <div className='flex gap-2'>
        <ModeToggle />
        <Separator orientation="vertical" className="h-5" />
        <ProfileButton />
      </div>
    </div>
  )
}