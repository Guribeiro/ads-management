import { ComponentProps } from "react"
import { Alert } from "../ui/alert"

type FeedbackAlertContainerProps = ComponentProps<typeof Alert>

export const FeedbackAlertContainer = ({ children, variant, ...props }: FeedbackAlertContainerProps) => {
  return (
    <Alert variant={variant} {...props}>
      {children}
    </Alert>
  )
}