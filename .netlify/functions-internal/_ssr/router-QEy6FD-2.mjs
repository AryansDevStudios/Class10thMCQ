import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import {
  b as createRouter,
  a as createRootRouteWithContext,
  d as useRouter,
  L as Link,
  O as Outlet,
  H as HeadContent,
  S as Scripts,
  c as createFileRoute,
  l as lazyRouteComponent,
} from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "async_hooks";
import "stream";
import "util";
import "crypto";
import "../_libs/isbot.mjs";
const appCss = "/assets/styles-CrvT4kip.css";
const AuthCtx = reactExports.createContext(null);
const STUDENT_KEY = "atp.student";
const ADMIN_KEY = "atp.admin";
function AuthProvider({ children }) {
  const [student, setStudent] = reactExports.useState(null);
  const [isAdmin, setIsAdmin] = reactExports.useState(false);
  reactExports.useEffect(() => {
    try {
      const s = localStorage.getItem(STUDENT_KEY);
      if (s) setStudent(JSON.parse(s));
      setIsAdmin(localStorage.getItem(ADMIN_KEY) === "1");
    } catch {}
  }, []);
  const loginStudent = (s) => {
    localStorage.setItem(STUDENT_KEY, JSON.stringify(s));
    setStudent(s);
  };
  const logoutStudent = () => {
    localStorage.removeItem(STUDENT_KEY);
    setStudent(null);
  };
  const setAdmin = (v) => {
    if (v) localStorage.setItem(ADMIN_KEY, "1");
    else localStorage.removeItem(ADMIN_KEY);
    setIsAdmin(v);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthCtx.Provider, {
    value: { student, isAdmin, loginStudent, logoutStudent, setAdmin },
    children,
  });
}
function useAuth() {
  const ctx = reactExports.useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    className: "flex min-h-screen items-center justify-center bg-background px-4",
    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
      className: "max-w-md text-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
          className: "text-7xl font-bold text-foreground",
          children: "404",
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
          className: "mt-4 text-xl font-semibold text-foreground",
          children: "Page not found",
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
          className: "mt-2 text-sm text-muted-foreground",
          children: "The page you're looking for doesn't exist or has been moved.",
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "mt-6",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
            to: "/",
            className:
              "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
            children: "Go home",
          }),
        }),
      ],
    }),
  });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    className: "flex min-h-screen items-center justify-center bg-background px-4",
    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
      className: "max-w-md text-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
          className: "text-xl font-semibold tracking-tight text-foreground",
          children: "This page didn't load",
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
          className: "mt-2 text-sm text-muted-foreground",
          children: "Something went wrong on our end. You can try refreshing or head back home.",
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className: "mt-6 flex flex-wrap justify-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
              onClick: () => {
                router2.invalidate();
                reset();
              },
              className:
                "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
              children: "Try again",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", {
              href: "/",
              className:
                "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
              children: "Go home",
            }),
          ],
        }),
      ],
    }),
  });
}
const Route$b = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Class 10th MCQ Test" },
      { name: "description", content: "Class 10th MCQ Test - MP Public School" },
      { name: "author", content: "MP Public School" },
      { property: "og:title", content: "Class 10th MCQ Test" },
      { property: "og:description", content: "Class 10th MCQ Test - MP Public School" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@MPPublicSchool" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", {
    lang: "en",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("head", {
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("body", {
        className: "flex min-h-screen flex-col bg-slate-50",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", {
            className:
              "flex items-center gap-4 bg-white px-6 py-4 shadow-sm border-b border-slate-200",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                src: "/schoollogo.jpg",
                alt: "School Logo",
                className: "h-12 w-auto object-contain",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                    className: "text-xl font-bold tracking-tight text-slate-900",
                    children: "Class 10th MCQ Test",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className: "text-sm font-medium text-slate-500",
                    children: "MP Public School, Anandnagar Maharajganj",
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("footer", {
            className: "bg-slate-900 py-6 text-center text-sm text-slate-400",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
              children: [
                "© ",
                /* @__PURE__ */ new Date().getFullYear(),
                " MP Public School, Anandnagar Maharajganj. All rights reserved.",
              ],
            }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {}),
        ],
      }),
    ],
  });
}
function RootComponent() {
  const { queryClient } = Route$b.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, {
    client: queryClient,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, {
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    }),
  });
}
const $$splitComponentImporter$a = () => import("./admin-BgSoSM0m.mjs");
const Route$a = createFileRoute("/admin")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component"),
});
const $$splitComponentImporter$9 = () => import("./index-Dq7KmjaF.mjs");
const Route$9 = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Class 10th MCQ Test",
      },
      {
        name: "description",
        content: "Real-time MCQ testing platform for MP Public School.",
      },
    ],
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component"),
});
const $$splitComponentImporter$8 = () => import("./student.index-CphuJQsG.mjs");
const Route$8 = createFileRoute("/student/")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component"),
});
const $$splitComponentImporter$7 = () => import("./admin.index-BJ4lO6Jm.mjs");
const Route$7 = createFileRoute("/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component"),
});
const $$splitComponentImporter$6 = () => import("./student.register-BvaWdj79.mjs");
const Route$6 = createFileRoute("/student/register")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component"),
});
const $$splitComponentImporter$5 = () => import("./student.login-CIthETqc.mjs");
const Route$5 = createFileRoute("/student/login")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component"),
});
const $$splitComponentImporter$4 = () => import("./admin.students-CJsNG3NP.mjs");
const Route$4 = createFileRoute("/admin/students")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component"),
});
const $$splitComponentImporter$3 = () => import("./admin.tests.index-_1YuStVP.mjs");
const Route$3 = createFileRoute("/admin/tests/")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component"),
});
const $$splitComponentImporter$2 = () => import("./student.test._testId-B6GIGTWd.mjs");
const Route$2 = createFileRoute("/student/test/$testId")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
});
const $$splitComponentImporter$1 = () => import("./admin.tests.new-Bor4Ddqz.mjs");
const Route$1 = createFileRoute("/admin/tests/new")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component"),
});
const $$splitComponentImporter = () => import("./admin.tests._testId.results-CfI3ob5K.mjs");
const Route = createFileRoute("/admin/tests/$testId/results")({
  component: lazyRouteComponent($$splitComponentImporter, "component"),
});
const AdminRoute = Route$a.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$b,
});
const IndexRoute = Route$9.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$b,
});
const StudentIndexRoute = Route$8.update({
  id: "/student/",
  path: "/student/",
  getParentRoute: () => Route$b,
});
const AdminIndexRoute = Route$7.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminRoute,
});
const StudentRegisterRoute = Route$6.update({
  id: "/student/register",
  path: "/student/register",
  getParentRoute: () => Route$b,
});
const StudentLoginRoute = Route$5.update({
  id: "/student/login",
  path: "/student/login",
  getParentRoute: () => Route$b,
});
const AdminStudentsRoute = Route$4.update({
  id: "/students",
  path: "/students",
  getParentRoute: () => AdminRoute,
});
const AdminTestsIndexRoute = Route$3.update({
  id: "/tests/",
  path: "/tests/",
  getParentRoute: () => AdminRoute,
});
const StudentTestTestIdRoute = Route$2.update({
  id: "/student/test/$testId",
  path: "/student/test/$testId",
  getParentRoute: () => Route$b,
});
const AdminTestsNewRoute = Route$1.update({
  id: "/tests/new",
  path: "/tests/new",
  getParentRoute: () => AdminRoute,
});
const AdminTestsTestIdResultsRoute = Route.update({
  id: "/tests/$testId/results",
  path: "/tests/$testId/results",
  getParentRoute: () => AdminRoute,
});
const AdminRouteChildren = {
  AdminStudentsRoute,
  AdminIndexRoute,
  AdminTestsNewRoute,
  AdminTestsIndexRoute,
  AdminTestsTestIdResultsRoute,
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute: AdminRouteWithChildren,
  StudentLoginRoute,
  StudentRegisterRoute,
  StudentIndexRoute,
  StudentTestTestIdRoute,
};
const routeTree = Route$b._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      getRouter,
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);
export { Route$2 as R, Route as a, router as r, useAuth as u };
