import React from 'react'

import { Button } from 'semantic-ui-react'
import Layout from '../components/layout'

import { Link } from 'gatsby'

const IndexPage = ({ data }) => {
  const {
    edges: posts
  } = data.allMarkdownRemark;
  return (
    <Layout>
      <h2>
        <span role="img" aria-label="Waving hand">
          👋
        </span>{' '}
        Hey there!
      </h2>

      <p>
        Welcome to this humble Gatsby Semantic UI starter. It is a very thin layer
        on top of the regular Gatsby 2 starter. All that has been added is
        Semantic UI as the component library of choice.
      </p>

      <p>
        Everything is pre-setup and ready to go. You can either use the default
        Semantic UI theme as it currently runs, or you can override all variables
        and make custom CSS changes in the <code>src/semantic/site</code> folder.
      </p>

      <p>
        The folder contains all the standard settings of the default theme so you
        don't have to remember which variables are available.
      </p>
      <div>
        {
          posts.map(({ node: post }) => {
            const { frontmatter } = post;
            return (
                <div key={post.id}>
                  <h2>
                    <Link to={frontmatter.path}>
                      {frontmatter.title}
                    </Link>
                  </h2>
                  <p>{frontmatter.date}</p>
                  <p>{frontmatter.excerpt}</p>
                </div>
            );
          })
        }
      </div>

      <Button primary>I'm a button!</Button>
    </Layout>
  )
}

export const query = graphql `
  query IndexQuery {
    allMarkdownRemark {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
            tags
            excerpt
          }
        }
      }
    }
  }
`;

export default IndexPage
