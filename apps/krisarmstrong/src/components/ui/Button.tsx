import type { ButtonProps as SharedButtonProps } from "@krisarmstrong/web-foundation";
import { Button as SharedButton } from "@krisarmstrong/web-foundation";

export type ButtonProps = SharedButtonProps;

export function Button(props: ButtonProps) {
  return <SharedButton {...props} />;
}
