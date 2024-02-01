import { useState, useEffect, useContext, useRef } from 'react'
import styles from '@/styles/blog/index/blogindex.module.css'
import { useRouter } from 'next/router'
// import ThemeContext from "@/contexts/ThemeContext";
import Link from 'next/link'
import { BLOG_LIST, BLOG_ONE, BLOG_CLASS } from '@/configs'
import AuthContext from '@/context/auth-context'
//輪播牆
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, A11y, Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/bundle'
import 'swiper/css/pagination'

import BlogCards from '@/components/blog/cards/blogcard'

//首圖
import FirstPhoto from '@/components/blog/index/indexfirstphoto'

//動畫
import { motion } from 'framer-motion'

//這邊去串後端 從後端撈到tags的十個資料

export default function BlogList() {
  //連動會員
  const { auth, blogFav } = useContext(AuthContext)
  const memberId = auth.id

  const [tags, setTags] = useState([])
  const getTagsData = async () => {
    try {
      const response = await fetch(BLOG_CLASS)
      const data = await response.json()
      setTags(data.map((item) => item.blogclass_content))
    } catch (ex) {
      console.log(ex)
    }
  }

  //loading
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getTagsData()
  }, []) // 在組件載入時執行

  const [data, setData] = useState({})
  // const [keyword, setKeyword] = useState('')

  const router = useRouter()

  const getListData = async () => {
    const usp = new URLSearchParams(router.query)

    //console.log('router.query:', router.query)
    let page = +router.query.page || 1

    // 關鍵字搜尋
    let keyword = router.query.keyword || ''

    // tag
    let tag = router.query.tag || ''

    // 排序
    let sortBy = router.query.sortBy || ''

    if (page < 1) page = 1
    try {
      //const r = await fetch(BLOG_LIST + `?${usp.toString()}`)
      const r = await fetch(
        `${BLOG_LIST}?${usp.toString()}`
        //?member_id=${memberId}
        // + `
      )
      //console.log(usp)
      const d = await r.json()
      console.log(d)
      setData(d)
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    getListData()
  }, [
    router.query.page,
    router.query.keyword,
    router.query.tag,
    router.query.sortBy,
  ])

  //part2-1
  const removeItemAndReload = async (blogarticle_id) => {
    console.log({ blogarticle_id })

    const r = await fetch(BLOG_ONE + '/' + blogarticle_id, {
      method: 'DELETE',
    })
    const result = await r.json()
    if (result.success) {
      // alert("完成刪除")
      //router.reload();
      getListData()
    }
  }

    //新版首圖icon
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseEnter = () => {
      setIsHovered(true)
    }
  
    const handleMouseLeave = () => {
      setIsHovered(false)
    }

 

  const cardSectionRef = useRef(null)

  return (
    <>
      {isLoading ? (
        <div className="container">
          <div className={styles['loading-box']}>
            <img src="/store/freefyt-loading.svg" />
          </div>
        </div>
      ) : (
        <>
          {/* 首頁圖 */}
          <FirstPhoto />
          
          {/* ICON */}
          <div
              className={styles.box}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={`${styles.hellos} ${
                  isHovered ? styles.helloHovered : ''
                }`}
              >
                <img src="/image/blog-indexbtn.png" />
              </div>
              {isHovered && (
                <ul className={styles.options}>
                  <button
                    className={styles.option}
                    onClick={() => {
                      // 點擊查看文章時滑動到卡片區
                      cardSectionRef.current.scrollIntoView({
                        behavior: 'smooth',
                      })
                    }}
                  >
                    查看文章
                  </button>
                  <Link href={`/blog/mylist/${memberId}`}>
                    <li className={styles.option}>我的首頁</li>
                  </Link>
                  <Link href={`/blog/mylist/add`}>
                    <li className={styles.option}>建立文章</li>
                  </Link>
                </ul>
              )}
            </div>
            

          {/* 搜尋匡 */}
          <div className="container">
            <section>
              <div className={styles['category-card']}>
                <div className={styles['category-title']}>
                  <span className={styles['select-text']}>SELECT</span>
                  <span className={styles['category-text']}>CATEGORY</span>
                </div>
              </div>
              <div className={styles['bg-class']}>
                <ul className={styles['bg-class-ul']}>
                  <li>
                    <button
                      onClick={(e) => {
                        // setKeyword(e.currentTarget.value)

                        router.push(
                          {
                            pathname: '/blog',
                            query: {
                              ...router.query,
                              sortBy: 'readFromHighToLow',
                            },
                          },
                          undefined,
                          { scroll: false }
                        )
                      }}
                    >
                      <div className={styles['bg-boxin01']}>POPULAR</div>
                      <div className={styles['bg-boxin02']}>熱門文章</div>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={(e) => {
                        // setKeyword(e.currentTarget.value)

                        router.push(
                          {
                            pathname: '/blog',
                            query: {
                              ...router.query,
                              sortBy: 'createFromHighToLow',
                            },
                          },
                          undefined,
                          { scroll: false }
                        )
                      }}
                    >
                      {' '}
                      <div className={styles['bg-boxin01']}>NEWEST</div>
                      <div className={styles['bg-boxin02']}>最新文章</div>
                    </button>
                  </li>
                </ul>
              </div>
              <div className={styles['bg-searchbox']}>
                <div className={styles['bg-search']}>
                  <span className={styles['bg-icon']}>
                    <i
                      className={styles['fa fa-search']}
                      style={{ color: '#000' }}
                    />
                  </span>
                  <form
                    role="search"
                    onSubmit={(e) => {
                      e.preventDefault()
                      router.push({
                        pathname: '/blog-list',
                        query: {
                          ...router.query,
                          keyword: e.currentTarget.keyword.value,
                        },
                      })
                    }}
                  >
                    <div className={styles['search-product']}>
                      <div className="input-group">
                        <input
                          type="search"
                          className={styles['bg-search']}
                          id="bg-search"
                          placeholder="請輸入搜尋關鍵字"
                          name="keyword"
                          onChange={(e) => {
                            // setKeyword(e.currentTarget.value)

                            router.push(
                              {
                                pathname: '/blog',
                                query: {
                                  ...router.query,
                                  keyword: e.target.value,
                                },
                              },
                              undefined,
                              { scroll: false }
                            )
                          }}
                        />
                      </div>
                      {/* <button className={styles['btn-search-product']}>搜尋</button> */}
                    </div>
                  </form>
                </div>
                <div className={styles['bg-tag']}>
                  <ul className={styles['bg-tagul']}>
                    <li>
                      {/* <button
                    className={styles['bg-taga']}
                    onClick={(e) => {
                      router.push(
                        {
                          pathname: '/blog',
                          query: { ...router.query, tag: undefined },
                        },
                        undefined,
                        { scroll: false }
                      )
                    }}
                  >
                    所有文章
                  </button> */}
                    </li>
                    <Swiper
                      modules={[Pagination, A11y, Autoplay, Navigation]}
                      spaceBetween={5}
                      slidesPerView={5}
                      navigation
                      autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                      }}
                      pagination={{ clickable: true }}
                      style={{ color: 'red' }}
                    >
                      {['所有文章', ...tags].map((tag) => {
                        return (
                          <SwiperSlide key={tag}>
                            <button
                              className={styles['bg-taga']}
                              onClick={(e) => {
                                if (tag === '所有文章') {
                                  router.push(
                                    {
                                      pathname: '/blog',
                                      query: {
                                        ...router.query,
                                        tag: undefined,
                                      },
                                    },
                                    undefined,
                                    { scroll: false }
                                  )
                                } else {
                                  router.push(
                                    {
                                      pathname: '/blog',
                                      query: { ...router.query, tag },
                                    },
                                    undefined,
                                    { scroll: false }
                                  )
                                }
                              }}
                            >
                              {tag}
                            </button>
                          </SwiperSlide>
                        )
                      })}
                    </Swiper>
                  </ul>
                </div>
              </div>
            </section>
            {/* 卡片區 */}
            <section>
              <div className={styles['blog-height']} ref={cardSectionRef}>
                論壇文章
              </div>
              {/* 卡片區 */}
              <BlogCards></BlogCards>
              {/* page 頁區*/}
              <div className={styles['col']}>
                <nav aria-label="Page navigation example">
                  <ul className={styles['pagination']}>
                    {data.success && data.totalPages
                      ? Array(11)
                          .fill(1)
                          .map((v, i) => {
                            const p = data.page - 6 + i
                            //先判斷 p的值有沒有在頁碼範圍
                            if (p < 1 || p > data.totalPages) return null
                            return (
                              <li
                                key={p}
                                className={
                                  p === data.page
                                    ? styles['page-item']
                                    : styles['page-item']
                                }
                              >
                                <Link
                                  className={styles['page-link']}
                                  href={'?page=' + p}
                                >
                                  {p}
                                </Link>
                              </li>
                            )

                            
                          })
                      : null}

                    {/*}
          
*/}
                  </ul>
                </nav>
              </div>
            </section>
          </div>
         

        </>
      )}
    </>
  )
}
