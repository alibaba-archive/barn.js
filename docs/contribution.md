# 贡献

## 开发指南

### 编译

#### 编译成 AMD 模块 

```bash
$ browserify es5/seed.js -t babelify --outfile es5/barn.js
```

#### 编译成 commonjs

```bash
$ babel src --out-dir commonjs
```

