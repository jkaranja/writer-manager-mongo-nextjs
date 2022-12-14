
//all nextjs  .setSomethingProps functions must be exported from under pages//not components
//GETsTATICprops() //no context object

import Meta from "../components/common/Meta";

//getServerSideProps(context) { //context has params
// /can be used as above but getInitialProps run both on server and client
//getInitialProps(context)//context has pathname, query, res, req, err, asPath

//use
//const { data, error } = useSWR('/api/user', fetch);
//It handles caching, revalidation, focus tracking, refetching on interval, and more.


export default function Home() {
  return (
    <div className="{styles.container}">
      <Meta />
    </div>
  );
}
