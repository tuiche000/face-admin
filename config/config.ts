import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

let config = {};

if (process.env.NODE_ENV == 'development') {
  config = require('./dev.env');
} else if (process.env.NODE_ENV == 'production') {
  config = require('./prod.env');
}

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: false,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  plugins,
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  base: '/rlsb/',
  publicPath: '/rlsb/',
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'user-login',
          path: '/user/login',
          component: './login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/BasicLayout',
      Routes: ['src/pages/Authorized'],
      authority: ['admin', 'user'],
      routes: [
        {
          path: '/',
          redirect: './dashboard/analysis',
        },
        {
          name: 'analysis',
          path: '/dashboard/analysis',
          icon: 'dashboard',
          component: './dashboard/analysis',
        },
        // {
        //   path: '/',
        //   name: 'welcome',
        //   icon: 'smile',
        //   component: './Welcome',
        // },
        {
          name: 'deviceauth',
          path: '/deviceauth',
          icon: 'setting',
          component: './deviceauth',
        },
        {
          name: 'notice',
          path: '/notice',
          icon: 'message',
          component: './notice',
        },
        {
          name: 'business',
          path: '/business',
          icon: 'setting',
          routes: [
            {
              name: 'business-floor',
              path: '/business/floor',
              component: './business/floor',
            },
            {
              name: 'business-device',
              path: '/business/device',
              component: './business/device',
            },
            {
              name: 'business-banner',
              path: '/business/banner',
              component: './business/banner',
            },
          ],
        },
        {
          name: 'userrole',
          path: '/userrole',
          icon: 'team',
          routes: [
            {
              name: 'userrole-empolyee',
              path: '/userrole/empolyee',
              component: './userrole/empolyee',
            },
            {
              name: 'userrole-visitor',
              path: '/userrole/visitor',
              component: './userrole/visitor',
            },
            {
              name: 'userrole-department',
              path: '/userrole/department',
              component: './userrole/department',
            },
          ],
        },
        {
          name: 'list',
          path: '/list/table/list',
          component: './list/table/list',
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    'process.env.config': config,
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  // proxy: {
  //   '/api': {
  //     target: 'http://visit.fothing.com',
  //     changeOrigin: true,
  //     pathRewrite: {
  //       '^/api': '/api',
  //     },
  //   },
  // },
} as IConfig;
