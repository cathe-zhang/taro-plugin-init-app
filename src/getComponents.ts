const fs = require('fs')

/**
 * 扫描components文件夹生成index.ts 以支持一行代码写完组件引入
 * 示例：import { Card, TImage } from '~/components'
 */
const checkComponent = () => {
  console.log('检查组件')

  if (fs.existsSync('./src/components/index.ts')) {
    fs.unlinkSync('./src/components/index.ts')
    console.log('删除index.ts')
  }

  let indexLines = `/**
 * 注意：此文件为编译时自动生成，无需手动修改
*/
`
  let Names = ``

  const outerDirs = fs.readdirSync('./src/components')

  outerDirs.forEach((item) => {
    const innerDir = fs.readdirSync(
      `./src/components/${item}`
    )

    // 去除后缀名
    const newLines: any = []
    innerDir.forEach((inItem) => {
      const sliceRes = inItem.slice(0, inItem.indexOf('.'))
      // 去重
      if (newLines.indexOf(sliceRes) === -1) {
        newLines.push(sliceRes)
        Names = Names
          ? `${Names}
  ${sliceRes},`
          : `${sliceRes},`
      }
    })

    newLines.forEach((inItem) => {
      indexLines = indexLines
        ? `${indexLines}
import ${inItem} from './${item}/${inItem}';`
        : `import ${inItem} from './${item}/${inItem}';`
    })
  })
  indexLines = `${indexLines}

export {
  ${Names}
}`

  fs.writeFileSync('./src/components/index.ts', indexLines)
  console.log('组件扫描完成，components/index.ts创建成功')
}

export default checkComponent
