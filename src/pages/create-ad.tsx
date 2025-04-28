import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router";

export const CreateAdPage = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl w-full mx-auto p-6">
      <div className="flex items-center justify-between py-4  bg-background sticky">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    </div>
  )
}