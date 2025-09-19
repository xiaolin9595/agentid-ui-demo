# Page snapshot

```yaml
- generic [ref=e3]:
  - heading "PNG图片测试" [level=2] [ref=e4]
  - generic [ref=e5]:
    - generic [ref=e6]:
      - heading "Public目录PNG测试" [level=3] [ref=e7]
      - img "Test PNG from public directory" [ref=e8]
      - paragraph [ref=e9]: "路径: /test-image.png"
    - generic [ref=e10]:
      - heading "Assets目录PNG测试" [level=3] [ref=e11]
      - img "Test PNG from assets directory" [ref=e12]
      - paragraph [ref=e13]: "路径: src/assets/test-image-2.png (通过import)"
    - generic [ref=e14]:
      - heading "在线PNG测试" [level=3] [ref=e15]
      - img "Online PNG test" [ref=e16]
      - paragraph [ref=e17]: "路径: 在线图片URL"
    - generic [ref=e18]:
      - heading "Base64 PNG测试" [level=3] [ref=e19]
      - img "Base64 PNG test" [ref=e20]
      - paragraph [ref=e21]: "格式: Base64编码"
  - generic [ref=e22]:
    - heading "测试说明:" [level=3] [ref=e23]
    - list [ref=e24]:
      - listitem [ref=e25]: 本页面测试PNG图片在不同位置和格式下的显示情况
      - listitem [ref=e26]: 如果某个图片无法显示，说明该项目不支持该类型的图片加载
      - listitem [ref=e27]: 检查浏览器控制台是否有相关错误信息
      - listitem [ref=e28]: public目录的图片可以通过绝对路径访问
      - listitem [ref=e29]: src/assets目录的图片需要通过import导入
```