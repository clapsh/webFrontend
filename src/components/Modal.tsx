interface Props {
  children: React.ReactNode
  onClose?: () => void
}

export default function Modal({ children, onClose }: Props) {
  return (
    <div className="modal fixed top-0 left-0 flex h-screen w-screen items-center justify-center">
      <div
        className="overlay absolute top-0 left-0 h-full w-full bg-black/70"
        onClick={() => onClose?.()}></div>
      <div className="content relative z-1 max-h-[calc(100%-100px)] w-max max-w-[500px] min-w-[100px] overflow-y-auto rounded-[10px] bg-white p-[20px]">
        {children}
      </div>
    </div>
  )
}
