import { Rule, RuleTester } from "eslint";
import rule from "src/require-usememo";

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },
});

ruleTester.run("useMemo", rule as Rule.RuleModule, {
  valid: [
    {
      code: `const Component = () => {
      const myObject = React.useMemo(() => ({}), []);
      return <Child prop={myObject} />;
    }`,
    },
    {
      code: `const Component = () => {
      const myArray = React.useMemo(() => [], []);
      return <Child prop={myArray} />;
      }`
    },
    {
      code: `
      function Component({data}) {
      return <Child prop={data} />;
    }`,
    },
    {
      code: `
      function x() {}
      function Component() {
      return <Child prop={x} />;
    }`,
    },
    {
      code: `const Component = () => {
      const myArray = React.useMemo(() => new Object(), []);
      return <Child prop={myArray} />;
      }`
    },
    {
      code: `function Component() {
      const myArray = React.useMemo(() => new Object(), []);
      return <Child prop={myArray} />;
      }`
    },
    {
      code: `
      const myArray = new Object();
      class Component {
        render() {
          return <Child prop={myArray} />;
        }
      }`,
    },
    {
      code: `
      const myArray = new Object();
      function Component() {
        return <Child prop={myArray} />;
      }`,
    },
    {
      code: `class Component {
        constructor(props){
          super(props);
          this.state = {
            myData: new Object(),
          };
        }
        render() {
          const {myData} = this.state;
          return <Child prop={myData} />;
        }
      }`,
    },
    {
      code: `class Component {
        constructor(props){
          super(props);
          this.state = {
            myArray: [],
          };
        }
        render() {
          const {myArray} = this.state;
          return <Child prop={myArray} />;
        }
      }`,
    },
    {
      code: `
      const myArray = [];
      class Component {
        render() {
          return <Child prop={myArray} />;
        }
      }`,
    },
    {
      code: `
      function test() {}
      class Component {
        render() {
          return <Child prop={test} />;
        }
      }`,
    },
    {
      code: `const Component = () => {
        const myObject = {};
        return <div prop={myObject} />;
      }`,
    },
    {
      code: `const Component = () => {
        const myArray = [];
        return <div prop={myArray} />;
      }`,
    },
    {
      code: `class Component {
        render() {
          const myArray = [];
          return <div prop={myArray} />;
        }
      }`,
    },
    {
      code: `const Component = () => {
        const myNumber1 = 123;
        const myNumber2 = 123 + 456;
        const myString1 = 'abc';
        const myString2 = \`abc\`;
        return <div n1={myNumber} n2={myNumber2} s1={myString1} s2={myString2} />;
      }`,
    },
    {
      code: `const Component = () => {
        const myObject = memoize({});
        return <Child prop={myObject} />;
      }`,
    },
    {
      code: `
      function test() {}
      const Component = () => {
        return <Child prop={test} />;
      }`,
    },
    {
      code: `
      function test() {}
      function Component() {
        return <Child prop={test} />;
      }`,
    },
    {
      code: `const Component = () => {
        const myArray = lodash.memoize([]);
        return <Child prop={myArray} />;
      }`,
    },
    {
      code: `const Component = () => {
        const myBool = false;
        return <Child prop={myArray} />;
      }`,
    },
    {
      code: `const Component = () => {
        const myString = 'test';
        return <Child prop={myArray} />;
      }`,
    },
    {
      code: `const Component = () => {
        const myComplexString = css\`color: red;\`;
        return <Child prop={myComplexString} />;
      }`,
    },
    {
      code: `function useTest() {
        const myBool = false;
        return myBool;
      }`,
    },
    {
      code: `
      const x = {};
      function useTest() {
        return {x};
      }`,
    },
    {
      code: `function useTesty() {
        const myString = '';
        return myString;
      }`,
    },
    {
      code: `function useTesty() {
        const myBool = React.useMemo(() => !!{}, []);
        return myBool;
      }`,
    },
    {
      code: `function useTesty() {
        const x = {};
        const myBool = React.useMemo(() => x, [x]);
        return myBool;
      }`,
    },
    {
        code: `
        function useTesty() {
          const x = {};
          return useData(x);
        }`,
        options: [{ checkHookReturnObject: true, checkHookCalls: false }],
      },
    {
        code: `
        function useTesty() {
          const x = {};
          return useData(x);
        }`,
        options: [{ checkHookReturnObject: true, ignoredHookCallsNames: {"useData": true} }],
      },
    {
      code: `const Component = () => {
        const myArray1 = [];
        const myArray2 = React.useMemo(() => myArray1, [myArray1]);
        return <Child prop={myArray2} />;
      }`,
    },
    {
      code: `function useTest() {
        const y: boolean | undefined = false;
        const x = useMemo(() => x, [y]);
        return {x};
      }`,
    },
    {
      code: `function useTest({data}: {data: boolean | undefined}) {
        const x = useMemo(() => !data, [data]);
        return {x};
      }`,
    },
  ],
  invalid: [
    {
      code: `const Component = () => {
        const myObject = {};
        return <Child prop={myObject} />;
      }`,
      errors: [{ messageId: "object-usememo-props" }],
    },
    {
      code: `const Component = () => {
        const myArray = [];
        return <Child prop={myArray} />;
      }`,
      errors: [{ messageId: "array-usememo-props" }],
    },
    {
      code: `const Component = () => {
        const myInstance = new Object();
        return <Child prop={myInstance} />;
      }`,
      errors: [{ messageId: "instance-usememo-props" }],
    },
    {
      code: `class Component {
        render() {
          const myInstance = new Object();
          return <Child prop={myInstance} />;
        }
      }`,
      errors: [{ messageId: "instance-class-memo-props" }],
    },
    {
      code: `const Component = () => {
        const firstInstance = React.useMemo(() => new Object(), []);
        const second = new Object();
        return <Child prop={firstInstance || second} />;
      }`,
      errors: [{ messageId: "instance-usememo-props" }],
    },
    {
      code: `const Component = () => {
        let myObject = React.useMemo(() => ({}), []);
        myObject = {a: 'b'};
        return <Child prop={myObject} />;
      }`,
      errors: [{ messageId: "usememo-const" }],
    },
    {
      code: `const Component = () => {
        return <Child prop={{}} />;
      }`,
      errors: [{ messageId: "object-usememo-props" }],
    },
    {
      code: `class Component {
        render() {
          return <Child prop={{}} />;
        }
      }`,
      errors: [{ messageId: "object-class-memo-props" }],
    },
    {
      code: `const Component = () => {
        return <Child prop={[]} />;
      }`,
      errors: [{ messageId: "array-usememo-props" }],
    },
    {
      code: `class Component {
        render() {
          return <Child prop={[]} />;
        }
      }`,
      errors: [{ messageId: "array-class-memo-props" }],
    },
    {
      code: `const Component = () => {
        const myObject = memoize({});
        return <Child prop={myObject} />;
      }`,
      options: [{ strict: true }],
      errors: [{ messageId: "unknown-usememo-props" }],
    },
    {
      code: `const Component = () => {
        const myArray = lodash.memoize([]);
        return <Child prop={myArray} />;
      }`,
      options: [{ strict: true }],
      errors: [{ messageId: "unknown-usememo-props" }],
    },
    {
      code: `class Component {
        render() {
          const myArray = lodash.memoize([]);
          return <Child prop={myArray} />;
        }
      }`,
      options: [{ strict: true }],
      errors: [{ messageId: "unknown-class-memo-props" }],
    },
    {
      code: `const Component = () => {
        const myComplexString = css\`color: red;\`;
        return <Child prop={myComplexString} />;
      }`,
      options: [{ strict: true }],
      errors: [{ messageId: "unknown-usememo-props" }],
    },
    {
      code: `const Component = () => {
        let myObject;
        myObject = {};
        return <Child prop={myObject} />;
      }`,
      errors: [{ messageId: "usememo-const" }],
    },
    {
      code: `function useTest() {
        const myObject = {};
        return myObject;
      }`,
      errors: [{ messageId: "object-usememo-hook" }],
    },
    {
      code: `function useTest() {
        const myObject = {};
        return {x: myObject };
      }`,
      errors: [{ messageId: "object-usememo-hook" }],
    },
    {
      code: `
      const myObject = {};
      function useTest() {
        return {x: myObject };
      }`,
      options: [{ checkHookReturnObject: true }],
      errors: [{ messageId: "object-usememo-hook" }],
    },
    {
      code: `function useTest() {
        function x() {}
        return {x};
      }`,
      errors: [{ messageId: "function-usecallback-hook" }],
    },
    {
      code: `function useTest() {
        const myFunction = () => {};
        return myFunction;
      }`,
      errors: [{ messageId: "function-usecallback-hook" }],
    },
    {
      code: `function useTest() {
        function myFunction(){ };
        return myFunction;
      }`,
      errors: [{ messageId: "function-usecallback-hook" }],
    },
    {
      code: `
      function useTesty() {
        const x = {};
        return useData(x);
      }`,
      options: [{ checkHookReturnObject: true, ignoredHookCallsNames: {"useOtherHook": true} }],
      errors: [{ messageId: "object-usememo-deps" }],
    },
    {
      code: `function useTest() {
        let y = '';
        const x = useMemo(() => '', []);
        return {x, y};
      }`,
      errors: [{ messageId: "usememo-const" }],
    },
    {
      code: `const useTest = () => {
        const x: boolean | undefined = false;
        function y() {}
        return {x, y};
      }`,
      errors: [{ messageId: "function-usecallback-hook" }],
    },
  ],
});
