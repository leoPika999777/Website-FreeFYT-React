import styles from '@/styles/blog/index/indexphoto.module.css';

// 動畫
import { motion } from 'framer-motion';

export default function FirstPhoto() {
  return (
    <>
      <div className={styles['headphoto']}>
        <div className={styles['blog-headimg']}>
          <img
            src="/image/blog-02.png"
            // alt="{v.name} "
          />
          {/* <Image src="/image/blog-01.png" width={'300'} height={'800'} style={{width:'100%',height:'80vh'}} alt="" /> */}
        </div>
        <motion.div
          className={styles['blog-word0']}
          initial={{
            opacity: 0,
            x: 90,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 5, // Increase the duration to 10 seconds
            },
          }}
          viewport={{ once: true }}
        >
          <p>CREATE</p>
        </motion.div>
        <motion.div
          className={styles['blog-word1']}
          initial={{
            opacity: 0,
            x: 90,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 5, // Increase the duration to 10 seconds
            },
          }}
          viewport={{ once: true }}
        >
          <p>YOUR</p>
        </motion.div>
        <motion.div
          className={styles['blog-word2']}
          initial={{
            opacity: 0,
            x: 90,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 5, // Increase the duration to 10 seconds
            },
          }}
          viewport={{ once: true }}
        >
          <p>#BLOG</p>
        </motion.div>
      </div>
    </>
  );
}
