const isFrameNode = (c: BaseNode): c is FrameNode => c.type === "FRAME"
const isInstanceNode = (c: BaseNode): c is InstanceNode => c.type === "INSTANCE"
const isVectorNode = (c: BaseNode): c is VectorNode => c.type === "VECTOR"

const detach = (c: BaseNode) => figma.union([c], c.parent)

const detachAndFlatten = (page: PageNode) => {
  const frames = page.children.filter(isFrameNode)

  for (let frame of frames) {
    frame.children.filter(isInstanceNode).forEach(detach)
  }

  for (let frame of frames) {
    frame.findChildren(isVectorNode).filter(isVectorNode).forEach(c => c.outlineStroke())
  }

  for (let frame of frames) {
    frame.children.forEach(c => figma.flatten([c]))
  }
}

export default function () {
  const page = figma.currentPage.clone()
  figma.currentPage = page
  detachAndFlatten(page)
  figma.closePlugin()
}
