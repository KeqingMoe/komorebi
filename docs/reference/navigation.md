# 导航配置

控制页头导航栏中显示的链接。

## 基本用法

`nav` 接受 `KomorebiNavLink[]` 数组，每项包含 `href` 和 `label` 两个字段：

```ts
interface KomorebiNavLink {
  href: string;
  label: string;
}
```

不设置 `nav` 时，导航栏默认显示所有内置页面链接。

## 快捷函数 `navLinks()`

使用 `navLinks()` 可以一次性引入所有内置页面链接：

```ts
import komorebi, { navLinks } from 'komorebi-theme';

export default defineConfig({
  nav: navLinks(),
});
// → 首页 | 文章 | 归档 | 友链 | 关于
```

内置链接的顺序固定为：首页 → 文章 → 归档 → 友链 → 关于。

### 追加额外链接

传入额外链接会拼接到内置链接之后、"关于"之前：

```ts
export default defineConfig({
  nav: navLinks([{ label: '工具', href: '/tools' }]),
});
// → 首页 | 文章 | 归档 | 友链 | 工具 | 关于
```

## 单独使用链接函数

每个内置页面都有对应的快捷函数，可以在需要精细控制导航顺序时使用：

```ts
import {
  homeLink,
  blogLink,
  archiveLink,
  friendsLink,
  aboutLink,
} from 'komorebi-theme';

export default defineConfig({
  nav: [
    homeLink(),
    blogLink(),
    aboutLink(),
  ],
});
// → 首页 | 文章 | 关于
```

### 可用的链接函数

| 函数 | 默认标签 | 链接 |
| - | - | - |
| `homeLink(label?)` | 首页 | `/` |
| `blogLink(label?)` | 文章 | `/blog` |
| `archiveLink(label?)` | 归档 | `/archive` |
| `friendsLink(label?)` | 友链 | `/friends` |
| `aboutLink(label?)` | 关于 | `/about` |

每个函数接受一个可选的 `label` 参数，覆盖默认标签文本：

```ts
export default defineConfig({
  nav: [
    homeLink('Home'),
    blogLink('Posts'),
    archiveLink(),
    friendsLink(),
    aboutLink('About Me'),
  ],
});
// → Home | Posts | 归档 | 友链 | About Me
```

## 完全自定义

你也可以不使用任何辅助函数，完全手动定义导航链接：

```ts
export default defineConfig({
  nav: [
    { label: '首页', href: '/' },
    { label: '文章', href: '/blog' },
    { label: '项目', href: '/projects' },
    { label: '关于', href: '/about' },
  ],
});
```

`href` 可以是站内路径（以 `/` 开头）或完整的外部 URL。

## 典型场景

### 只显示部分页面

```ts
export default defineConfig({
  nav: [
    homeLink(),
    blogLink(),
    aboutLink(),
  ],
});
```

### 修改默认标签语言

```ts
export default defineConfig({
  nav: [
    homeLink('Home'),
    blogLink('Articles'),
    archiveLink('Archive'),
    friendsLink('Friends'),
    aboutLink('About'),
  ],
});
```

### 在特定位置插入外部链接

```ts
export default defineConfig({
  nav: [
    homeLink(),
    blogLink(),
    { label: 'GitHub', href: 'https://github.com/user/repo' },
    archiveLink(),
    friendsLink(),
    aboutLink(),
  ],
});
```
