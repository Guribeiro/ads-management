import { AlertDescription } from "../ui/alert"
import { ComponentProps } from "react"

type FeedbackAlertDescriptionProps = ComponentProps<typeof AlertDescription>

export const FeedbackAlertDescription = ({ children }: FeedbackAlertDescriptionProps) => {
  return <AlertDescription>{children}</AlertDescription>
}