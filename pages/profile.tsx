import { useSelector } from "react-redux";



export default function Home({ skills }) {
    const userProfile = useSelector((state:any) => state.userProfileMode.value)

  return (
    <div className="bg-gray-50 pt-12 sm:pt-16">
  <pre>{ JSON.stringify(userProfile, null, 2) }</pre>
    </div>
  );
}

export async function getStaticProps() {
return {props: {}}
}
