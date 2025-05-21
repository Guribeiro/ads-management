import { AlertTitle } from "../ui/alert"
import { ComponentProps } from "react"

type FeedbackAlertTitleProps = ComponentProps<typeof AlertTitle>

export const FeedbackAlertTitle = ({ children }: FeedbackAlertTitleProps) => {
  return <AlertTitle>{children}</AlertTitle>
}