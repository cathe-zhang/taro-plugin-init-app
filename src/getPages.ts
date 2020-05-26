const fs = require('fs')

/**
 * 扫描pages文件夹生成routes.js 即app.tsx中的pages配置项
 */
const getPages = () => {
  return new Promise(resolve => {
    console.log('开始扫描页面')

    if (fs.existsSync('./src/pages/routes.js')) {
      fs.unlinkSync('./src/pages/routes.js')
      console.log('删除pages/route.js')
    }

    let indexLines = `/**
 * 路由文件 编译时自动生成，无需手动修改，但页面有增删改操作时需要重启项目
 */

const pages = [
  'pages/home/index',`
    const pages: any = []

    const outerDirs = fs.readdirSync('./src/pages')

    outerDirs.forEach(item => {
      // 跳过特殊文件夹
      if (!['.DS_Store'].includes(item)) {
        const innerDir = fs.readdirSync(`./src/pages/${item}`)
        console.log('innerDir', innerDir)

        // 去除后缀名
        innerDir.forEach(inItem => {
          const sliceRes = inItem.slice(0, inItem.indexOf('.'))
          // 去重
          if (
            pages.indexOf(`pages/${item}/${sliceRes}`) === -1 &&
            !['component'].includes(sliceRes)
          ) {
            pages.push(`pages/${item}/${sliceRes}`)
          }
        })
      }
    })

    pages.forEach(item => {
      if (item !== 'pages/home/index') {
        indexLines = indexLines
          ? `${indexLines}
  '${item}',`
          : `'${item}',`
      }
    })

    indexLines = `${indexLines}

]

module.exports = pages`

    let resolvePages = [
      'pages/home/index'
    ]
    pages.forEach(element => {
      if (element !== 'pages/home/index' ) {
        resolvePages.push(element)
      }
    });

    fs.writeFileSync('./src/pages/routes.js', indexLines)
    console.log('页面扫描完成，pages/routes.js创建成功')
    resolve(resolvePages)
  })
}

export default getPages