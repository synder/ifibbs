/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const async = require('async');
const chai = require('chai');
const request = require('supertest');
const Mock = require('mockjs');


const mongodb = require('../../../public/service/mongodb');
const elasticsearch = require('../../../public/service/elasticsearch').client;

const ifibbs = mongodb.ifibbs;

const Activity = ifibbs.model('Activity');
const QuestionAnswer = ifibbs.model('QuestionAnswer');
const Article = ifibbs.model('Article');
const AttentionQuestion = ifibbs.model('AttentionQuestion');
const AttentionSubject = ifibbs.model('AttentionSubject');
const AttentionUser = ifibbs.model('AttentionUser');
const SecurityCode = ifibbs.model('SecurityCode');
const UserAnswerCollection = ifibbs.model('UserAnswerCollection');
const UserArticleCollection = ifibbs.model('UserArticleCollection');
const AnswerComment = ifibbs.model('AnswerComment');
const UserDevice = ifibbs.model('UserDevice');
const UserFavourAnswer = ifibbs.model('UserFavourAnswer');
const UserFavourArticle = ifibbs.model('UserFavourArticle');
const UserFavourAnswerComment = ifibbs.model('UserFavourAnswerComment');
const UserHistory = ifibbs.model('UserHistory');
const UserNotification = ifibbs.model('UserNotification');
const Question = ifibbs.model('Question');
const Recommend = ifibbs.model('Recommend');
const QuestionTag = ifibbs.model('QuestionTag');
const Subject = ifibbs.model('Subject');
const User = ifibbs.model('User');
const UserDynamic = ifibbs.model('UserDynamic');
const UserShare = ifibbs.model('UserShare');

const USER_ID = "58aa50177ddbf5507c51f082";
const USER_ID_OTHER = "58aa50177ddbf5507c51f083";
const QUESTION_ID = "58ae5da34171fd177d387656";
const SUBJECT_ID = "58ae5da34171fd177d387637";
const ARTICLE_ID = "58ae5da34171fd177d387638";

const emptyCollection = function (callback) {
    async.parallel([
        function (cb) {
            Activity.remove({}, cb);
        },
        function (cb) {
            QuestionAnswer.remove({}, cb);
        },
        function (cb) {
            Article.remove({}, cb);
        },
        function (cb) {
            AttentionQuestion.remove({}, cb);
        },
        function (cb) {
            AttentionSubject.remove({}, cb);
        },
        function (cb) {
            AttentionUser.remove({}, cb);
        },
        function (cb) {
            SecurityCode.remove({}, cb);
        },
        function (cb) {
            UserAnswerCollection.remove({}, cb);
        },
        function (cb) {
            UserArticleCollection.remove({}, cb);
        },
        function (cb) {
            AnswerComment.remove({}, cb);
        },
        function (cb) {
            UserDevice.remove({}, cb);
        },
        function (cb) {
            UserFavourAnswer.remove({}, cb);
        },
        function (cb) {
            UserFavourArticle.remove({}, cb);
        },
        function (cb) {
            UserFavourAnswerComment.remove({}, cb);
        },
        function (cb) {
            UserHistory.remove({}, cb);
        },
        function (cb) {
            UserNotification.remove({}, cb);
        },
        function (cb) {
            Question.remove({}, cb);
        },
        function (cb) {
            Recommend.remove({}, cb);
        },
        function (cb) {
            QuestionTag.remove({}, cb);
        },
        function (cb) {
            Subject.remove({}, cb);
        },
        function (cb) {
            User.remove({}, cb);
        },
        function (cb) {
            UserDynamic.remove({}, cb);
        },
        function (cb) {
            UserShare.remove({}, cb);
        },
    ], callback);
};

/**
 * @desc 初始化用户通知
 * */
const initUserNotification = function (callback) {
    let docs = [];

    for (let i = 0; i < 10; i++) {
        docs.push({
            status: UserNotification.STATUS.UNREAD,      //通知状态
            category: UserNotification.CATEGORY.BUSINESS,      //通知类别
            type: UserNotification.TYPE.USER_PUBLISH_QUESTION,      //通知类型
            push_title: Mock.Random.ctitle(10, 20),      //通知标题
            push_content: Mock.Random.ctitle(10, 20),      //通知内容
            push_content_id: QUESTION_ID,      //通知内容
            push_client_id: 'xxx',     //客户端ID，详见个推文档
            push_task_id: 'xxx',     //任务ID，详见个推文档
            push_time: null,   //推送时间
            create_time: new Date(),    //创建时间
            update_time: new Date(),    //更新时间
            user_id: USER_ID,    //用户ID
        });
    }

    for (let i = 0; i < 10; i++) {
        docs.push({
            status: UserNotification.STATUS.UNREAD,      //通知状态
            category: UserNotification.CATEGORY.SYSTEM,      //通知类别
            type: UserNotification.TYPE.USER_PUBLISH_QUESTION,      //通知类型
            push_content_id: QUESTION_ID,      //通知内容
            push_title: Mock.Random.ctitle(10, 20),      //通知标题
            push_content: Mock.Random.ctitle(10, 20),      //通知内容
            push_client_id: 'xxx',     //客户端ID，详见个推文档
            push_task_id: 'xxx',     //任务ID，详见个推文档
            push_time: null,   //推送时间
            create_time: new Date(),    //创建时间
            update_time: new Date(),    //更新时间
            user_id: USER_ID,    //用户ID
        });
    }

    for (let i = 0; i < 10; i++) {
        docs.push({
            status: UserNotification.STATUS.UNREAD,      //通知状态
            category: UserNotification.CATEGORY.SYSTEM,      //通知类别
            type: UserNotification.TYPE.USER_QUESTION_BEEN_STICKIED,      //通知类型
            push_content_id: QUESTION_ID,      //通知内容
            push_title: Mock.Random.ctitle(10, 20),      //通知标题
            push_content: Mock.Random.ctitle(10, 20),      //通知内容
            push_client_id: 'xxx',     //客户端ID，详见个推文档
            push_task_id: 'xxx',     //任务ID，详见个推文档
            push_time: null,   //推送时间
            create_time: new Date(),    //创建时间
            update_time: new Date(),    //更新时间
            user_id: USER_ID,    //用户ID
        });
    }

    UserNotification.create(docs, callback);
};

/**
 * @desc 初始化专题数据
 * */
const initSubject = function (callback) {

    let icon = 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518';
    let cover = 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518';

    let docs = [];

    docs.push({
        _id: SUBJECT_ID,
        status: Subject.STATUS.ENABLE,
        title: Mock.Random.ctitle(10, 20),
        describe: Mock.Random.ctitle(50, 100),
        icon: icon,
        cover: cover,
        article_count: 0,
        attention_count: 0,
        display_order: 11,
        create_time: new Date(),
        update_time: new Date(),
    });

    for (let i = 0; i < 10; i++) {
        docs.push({
            status: Subject.STATUS.ENABLE,
            title: Mock.Random.ctitle(10, 20),
            describe: Mock.Random.ctitle(50, 100),
            icon: icon,
            cover: cover,
            article_count: 0,
            attention_count: 0,
            display_order: Mock.Random.natural(1, 10),
            create_time: new Date(),
            update_time: new Date(),
        });
    }

    Subject.create(docs, callback);
};


/**
 * @desc 初始化文章数据
 * */
const initArticle = function (callback) {
    let content = `<h1>印度会成下一个委内瑞拉吗？不是不可能</h1><p class='come'><span></span><span>2017-01-19</span><span>15:38:17</span></p><p class="detailPic">
	<img alt="" height="308" src="http://p3.ifengimg.com/a/2016_52/23190e671b731c5_size40_w650_h400.jpeg" width="500" /></p>
<p class="picIntro">
	<span>新闻配图</span></p>
<p>
	印度总理穆迪在低收入阶层中仍然有很高的支持率。由于穆迪政府给国内的穷人画了一根巨大的胡萝卜，所以即使现状如何不堪，但他们依然愿意沉浸在当下的痛苦与麻木之中。在2014年的大选期间，穆迪曾向低收入人群承诺，一旦自己执政后就会没收所有的黑钱，并将会在每个穷人的账户中存入超过150万卢比（约合2.2万美元）的存款。</p>
<p>
	随着印度新货币政策的实施，大量的问题也随之被报道出来。部分问题钞票已经被印刷流通，而印度的货币体系也随之处于风雨飘摇之中。质量低劣的纸钞印刷部门也经常显示出其可怕的一面。随着政府声势浩大的旧币废止计划的推出，伪造新钞的不法活动也开始四处蔓延，其规模之大可能会超过以往任何时候。因此，穆迪政府现在又开始着手打击伪钞制造活动。</p>
<p>
	穆迪如何兑现自己在竞选期间的存款承诺，所有人都难以猜到答案。但是考虑到印度人均1718美元的GDP总值时，估计穆迪政府需要在每个人银行账户中存入超过人均GDP约1300%的现金，才能兑现当初的承诺。而这一数字总额将会超过美国国内GDP总值。显然，穆迪给印度民众的&ldquo;胡萝卜&rdquo;永远也可望而不可即。</p>
<p>
	那么又是什么打动了印度民众？可能是反腐倡廉的情结&mdash;&mdash;包括以薪水为主要收入的中产阶级&mdash;&mdash;简单来说是对贪婪和嫉妒的混合体进行改革的举措打动了民众。也有迹象表明，印度国内的个人所得税将会被废除。对中产阶级来说，这是非常有吸引力的举措。</p>
<p>
	被禁止流通的纸币必须在2016年12月31日之前全部存入银行，而穆迪的支持者们都普遍预期，他的存款承诺随后也将会宣布。世界上从来都不会有免费的午餐，而印度民众的银行账户也有可能会被冻结。因为印度政府没有能力印刷所有需要注入经济活动的现金。</p>
<p>
	2017年1月1日，当所有中产阶级人士从梦中醒来后就会发现，他们被政府欺骗了。而穆迪政府的支持率也会随之轰然倒塌。有证据表明，不仅是反对人士，甚至穆迪自己党内的人士也对政府的非货币化方案颇有微词。这些政客们手里持有成袋的废止货币，而现在他们不得不拿出20%的部分来让黑手党帮助自己洗钱。</p>
<p>
	但他们不能公开反对穆迪，因为公开反对意味着要冒被视为腐败和不爱国的风险。由此来看，穆迪最终有可能会失去支持自己的政治力量。</p>
<p>
	目前，印度国内的蔬菜价格已经下跌25-50%。电子交易几乎全部瘫痪，甚至一些大城市也不能幸免， 因为网络连接常常是坏的。你可以设想一下偏远地区是如何运转的，这些地方甚至连电力和互联网都没有。人们需要注意到一个事实，物价下降不是因为供应过剩造成，而是由于穷人买不起任何东西。他们正在走向饥寒交迫的境地吗？</p>
<p>
	<strong>印度会是下一个委内瑞拉吗？</strong></p>
<p>
	作为世界上最大的民主国家，印度被一群&ldquo;香蕉共和国&rdquo;所包围，这些国家包括：巴基斯坦、孟加拉、尼泊尔、斯里兰卡、缅甸、泰国和阿富汗等。目前，中东地区和非洲地区的形势依然令人堪忧。</p>
<p>
	这似乎让印度拥有很多值得庆贺地方。在从英国统治之下独立后的70年里，其民主制度也一直得以延续。军队一直处于平民控制之中。而今天的印度同样也被认为是一个信息技术大国。它被认为是全球增速最快的较大经济体。印度被认为是下一个中国，因此关于它的故事仍在继续。</p>
<p>
	而现实中的印度却与那些国际媒体镜头下的印度大相径庭。</p>
<p>
	印度拥有13.4亿人口，其人均GDP为1718美元。近50%的印度市民过着没有厕所、电力和自来水的生活。五岁以下的儿童中，有48%的孩子存在发育迟缓的问题，这一数字高于全球任何其他主要国家。</p>
<p>
	现实中的印度与国际媒体所杜撰的印度完全相反，如果把非洲地区看作一个国家，那么非洲的各项指标事实上要优于印度。</p>
<p>
	作为努力了解印度的第二步，将该国人口分成两部分是有意义的：25%的既得利益阶层&mdash;&mdash;直接或间接地&mdash;&mdash;在过去30年里，享受着互联网和廉价的电话设施。而剩余75%的人口依然生活在类似于中世纪的悲惨境地中，他们的生活几乎还处在茹毛饮血的时代。</p>
<p>
	从所有的意图和目的来看，印度也属于一个&ldquo;香蕉共和国&rdquo;&mdash;&mdash;一个可怜贫穷，而且充满各种疾病的地方。与其他全球公认的&ldquo;香蕉共和国&rdquo;相比，印度唯一的区别就是，迄今为止，国际媒体一直都在给它脸上镀金。印度政府的说客们在英国和美国国内不遗余力地给印度脸上贴金。正如上面所指出的，他们的主要目的就是为了保持海外印度人的自尊。</p>
<p>
	现在，拿印度和中国进行比较，似乎成为了一种时尚。事实上，这种比较似乎非常牵强。中国的人均GDP是印度的5倍还多。而中国的经济增长速度是印度绝对增长速度的4倍还多。如果经济增速保持目前印度7.5%，中国6.3%的水平不变，印度也需要超过135年的时间才能赶上中国的经济产出绝对值。</p>
<p>
	那些关心印度非货币化政策的人们都在不断重复一个问题，印度是否会成为下一个委内瑞拉。</p>
<p>
	这不是没有可能。</p>
<p>
	按人均计算，委内瑞拉的GDP总值是印度的7倍还多。当委内瑞拉的民众面临饥饿时，他们会开始反抗。印度民众却如此懦弱，甚至都懒得离开自己的家园。印度民众应该站起来反抗，特别是贫苦民众，他们得到的待遇实在是太差了。</p>
<p>
	印度何时成为下一个委内瑞拉，希望不要超过30年，人们应该有值得庆祝的理由。</p>
<p>
	几乎一半的印度人别无选择，只能露天解决出恭问题。但看似简单的一个问题，印度政府却证明自己无法解决。也就是这样一个政府，却准备把探测器发射到火星上去，同时还准备让自己的国家成为全球第一个无现金流通的经济体。在适当的时候，穆迪将会被印度的现实洪流无情冲走。无论谁接替他的职位，都将会使形势变得更加糟糕。会不会是一个军方将领？</p>
<p>
	人类几千年来逐部演化推进的经济交易方式在一夜之间被彻底清除。人们被迫回到以货易货的古老时代。</p>
<p>
	<strong>非货币化政策的继续</strong></p>
<p>
	据悉，印度国内超过90%的废止货币已经被存入银行，这被普遍认为是政府的一个巨大胜利。而来自孟买的经济学家Mithun B. Dutta却在一份投资提示中解释称，现实与此完全背道而驰。他认为，非货币化政策应该是被废止货币的全部存入银行时才具有现实意义。</p>
<p>
	直到最近，废止纸币依然以面值20%的折扣在市面上流通。最近几天，不仅这种折扣消失了，而且其他被废止的纸币以溢价10%的价格在市面上交易。最贫穷的人们往往缺乏存款，也很难将自己的存款拿回来。银行外面的排队长龙仍然在继续，人们的心情也越来越绝望。企业正在倒闭，许多人经济受损而且很难东山再起。穷人正在失去自己的工作。</p>
<p>
	食品价格下降25-50%，农民没有足够资金去支持下一年的作物种植。商店里空空荡荡，因为人们的随意支出计划已经被搁置。许多企业的销售额急剧下降。据说小麦的播种量也在急剧下降。</p>
<p>
	当自己身陷绝望时，谁又会在乎别人的问题呢？这位奄奄一息的老妇人就是印度人口中75%底层民众的真实写照。她甚至连自己的名字都不会写，但仍然被期望学会使用银行卡。对穆迪政府来说，如果她不纳税，就不能被看作是正规经济统计中的一个数字。但这将会是被穆迪政府摒弃的数字。</p>
<p>
	靠薪水为生的中产阶级人士是穆迪政府的最大支持者，现在他们面对的压力也正在慢慢开始。当他们在12月1日去银行领自己的薪水时，就会不得不与那些乡下穷人挤在一起。对中产阶层人士来说，他们对乡下人有着根深蒂固的厌恶之情。他们可能不得不空手而归，或者只拿到少的可怜的现金。</p>
<p>
	这些中产阶级幻想在非货币化最后期限的12月31日之后，自己的银行账户仍然不会被冻结。但现实会告诉他们所有的账户都将会被冻结。就像一个简单的数学证明，并不存在其他的可能性。12月31日，穆迪将会发表一个新的公告，希望能够保持自己的社会工程项目按预定轨道运行，尽管还有其他的修补。另外也希望借此提振民众对政府的信心。</p>
<p>
	目前，印度国内自发的暴力活动正在猛增。而印度警方却缺乏足够的训练和控制社会动荡的物质基础。</p>
<p>
	<strong>结论</strong></p>
<p>
	没有人能解释非货币化政策为何会让腐败下降的问题。绝大部分未兑现的现金已经被存入银行。但尽管如此，银行外面的排队队伍却永远没有尽头。这不是银联服务，所以那些最贫穷的人有可能无法存款，也无法拿回自己的存款。</p>
<p>
	印度政府有在12月31日正式截止日期之后，冻结所有银行账户的意图。由此产生的巨大人力成本，将会使该国经济停滞不前。穆迪正在逐渐失去对自己党派的控制。他把自己隔离在一个茧中，周围环绕着唯唯诺诺的庸人。但对于迄今为止一直认为自己处于道德制高点的中产阶层来说，他们现在也开始经历与现金相关的各种问题。</p>
<p>
	与此同时，政治上的反对派处于一种支离破碎的状态。穆迪可能无法想象失去权力后的痛苦，他自认为是印度不可或缺的领导人。如果穆迪看到自己的支持率正在下降，印度就有可能会被推向专制统治。</p>
<p>
	要正确理解所有的暗流，这是第一个要考虑的原则：印度是一个社会结构非常不合理的国家，是一个存在部落和封建势力统治的地方。尽管它与英国保持了长达300年的长期往来关系，但依然缺乏理性概念的适用。印度今天的社会和政治结构是由英国人一手打造的。但这种结构的崩溃是不可避免的，因为印度人普遍缺乏维持这种体制的意志和能力。</p>
<p>
	一个缺乏理性的社会是不可能分辨出对与错的。它不能尊重个人或发展道德本能。它的人民将缺乏同情和共鸣，正如其中产阶层对底层人民所经历痛苦的漠不关心一样。对这些人来说，他们所受到的西方教育，仅仅是作为另一种信仰体系而存在于自己的头脑之中。显然，他们甚至无法理解，一个道德社会是不能允许政府随意撕毁合同情况的存在&mdash;&mdash;这种合同关系就体现在政府发行的货币上面。</p>
<p>
	即使是穷人默默地受苦，甚至更糟的是他们之间出现抗争。但由于缺乏对道德准则的必要理解，所以在自己受到不公正对待时，他们也逆来顺受。他们没有将自己的愤怒发泄到那些理应承担责任的人身上去，相反却将自己的挫折感归咎于身边更加懦弱的人们。</p>
<p>
	随着时间的推移，印度的政治结构将会逐步发生变化，以适应自己的非理性文化。文化不能仅仅依靠教育来改变，而文化的改变也需要很长时间的潜移默化。从某些问题点上来看，印度也许会瓦解分裂成为几个较小的国家或部落。这个国家的制度性腐败已经存在了70年，但作为催化剂的穆迪政府，却正在加快印度瓦解的步伐。就像很多身处南亚、中东、非洲和南美洲大部分地区的国家所发生的故事一样，印度也在上演类似的故事。</p>
<p>
	投资者应该关注什么？印度最终可能会成为一个可怕的投资目的地。印度国内的储户应该考虑将自己的财产转移到海外。印度政府仍然允许民众每年向海外转移25万美元的财产，但印度政府对资本管制的措施最终将会被建立。请记住，印度国内的储户已经溢价30%或以更高的价格来购买美元和英镑。现在，似乎没有一个好的理由让海外的印度人向印度国内寄钱。（双刀）<span class="ifengLogo"><a href="http://www.ifeng.com/" target="_blank"><img src="http://p2.ifengimg.com/a/2016/0810/204c433878d5cf9size1_w16_h16.png" /></a></span></p>
`;
    let icon = 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518';
    let cover = 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518';

    let docs = [{
        _id: ARTICLE_ID,
        status: Article.STATUS.PUBLISHED,    //文章状态
        top: true,    //是否置顶
        title: Mock.Random.ctitle(10, 20),    //文章标题
        summary: Mock.Random.ctitle(100, 200),    //文章摘要
        icon: icon,    //文章图标
        cover: cover,    //封面图片
        tags: ['测试'],    //文章标签
        content: encodeURIComponent(content),    //文章内容
        browse_count: 6,    //浏览次数
        favour_count: 7,    //被赞次数
        comment_count: 8,    //被评论次数
        collect_count: 9,    //被收藏次数
        create_time: new Date(),    //创建时间
        update_time: new Date(),    //更新时间
        subject_id: SUBJECT_ID,  //文章所属主题
        create_user_id: USER_ID      //创建人
    }];

    for (let i = 0; i < 100; i++) {
        docs.push({
            status: Article.STATUS.PUBLISHED,    //文章状态
            top: true,    //是否置顶
            title: Mock.Random.ctitle(10, 20),    //文章标题
            summary: Mock.Random.ctitle(100, 200),    //文章摘要
            icon: icon,    //文章图标
            cover: cover,    //封面图片
            tags: ['测试'],    //文章标签
            content: encodeURIComponent(Mock.Random.ctitle(100, 200)),    //文章内容
            browse_count: 6,    //浏览次数
            favour_count: 7,    //被赞次数
            comment_count: 8,    //被评论次数
            collect_count: 9,    //被收藏次数
            create_time: new Date(),    //创建时间
            update_time: new Date(),    //更新时间
            subject_id: SUBJECT_ID,  //文章所属主题
            create_user_id: USER_ID      //创建人
        });
    }

    Article.create(docs, callback);
};


/**
 * @desc 初始化问题数据
 * */
const initQuestion = function (callback) {
    let questions = [{
        "_id": QUESTION_ID,
        "status": 1,
        "title": Mock.Random.ctitle(5, 20),
        "describe": Mock.Random.ctitle(50, 100),
        "answer_count": 0,
        "favour_count": 0,
        "attention_count": 1,
        "collect_count": 0,
        "create_user_id": USER_ID,
        "create_time": new Date(),
        "update_time": new Date(),
        "tags": [],
    }];

    for (let i = 0; i < 100; i++) {
        questions.push({
            "_id": mongodb.ObjectId(),
            "status": 1,
            "title": Mock.Random.ctitle(5, 20),
            "describe": Mock.Random.ctitle(50, 100),
            "answer_count": 0,
            "favour_count": 0,
            "attention_count": 1,
            "collect_count": 0,
            "create_user_id": USER_ID,
            "create_time": new Date(),
            "update_time": new Date(),
            "tags": [],
        });
    }
    
    async.parallel({
        mongodb: function(cb) {
            Question.create(questions, cb);
        },
        elastic: function(cb) {
            let elasticQuestionDocuments = [];

            questions.forEach(function (question) {
                elasticQuestionDocuments.push({
                    "index": {
                        "_index": elasticsearch.indices.question,
                        "_type": elasticsearch.indices.question,
                        "_id": question._id.toString()
                    }
                });
                elasticQuestionDocuments.push({
                    create_user_id: question.create_user_id,
                    question_title: question.title,
                    question_describe: question.describe,
                    question_tags: question.tags,
                    create_time: question.create_time,
                    update_time: question.update_time,
                });
            });

            elasticsearch.bulk({
                body: elasticQuestionDocuments
            }, cb);
        },
    }, callback);
};


/**
 * @desc 初始化问题回答数据
 * */
const initQuestionAnswer = function (callback) {

    let answers = [];
    
    let questionID = mongodb.ObjectId();
    
    let question = {
        "_id": questionID,
        "status": 1,
        "title": '基金公司在中国的生存状态',
        "describe": '最早的对冲基金是哪一只，这还不确定。在上世纪20年代美国的大牛市时期，这种专门面向富人的投资工具数不胜数。其中最有名的是Benjamin Graham和Jerry Newman创立的Graham-Newman Partnership基金。',
        "answer_count": 0,
        "favour_count": 0,
        "attention_count": 1,
        "collect_count": 0,
        "create_user_id": USER_ID,
        "create_time": new Date(),
        "update_time": new Date(),
        "tags": ['基金'],
    };
    
    answers.push({
        "_id": mongodb.ObjectId(),
        "status": 1,
        "content": '最早的对冲基金是哪一只，这还不确定。在上世纪20年代美国的大牛市时期，这种专门面向富人的投资工具数不胜数。其中最有名的是Benjamin Graham和Jerry Newman创立的Graham-Newman Partnership基金。',
        "comment_count": 0,
        "favour_count": 0,
        "collect_count": 0,
        "question_id": QUESTION_ID,
        "create_user_id": USER_ID,
        "create_time": new Date(),
        "update_time": new Date(),
    });

    for (let i = 0; i < 100; i++) {
        answers.push({
            "_id": mongodb.ObjectId(),
            "status": 1,
            "content": Mock.Random.ctitle(20, 50),
            "comment_count": 0,
            "favour_count": 0,
            "collect_count": 0,
            "question_id": QUESTION_ID,
            "create_user_id": USER_ID,
            "create_time": new Date(),
            "update_time": new Date(),
        });
    }
    
    Question.create(question, function (err, question) {
        if(err){
            return callback(err);
        }

        async.parallel({
            mongodb: function(cb) {
                QuestionAnswer.create(answers, cb);
            },
            elastic: function(cb) {
                let elasticQuestionAnswerDocuments = [];

                answers.forEach(function (answer) {
                    elasticQuestionAnswerDocuments.push({
                        "index": {
                            "_index": elasticsearch.indices.answer,
                            "_type": elasticsearch.indices.answer,
                            "_id": answer._id.toString()
                        }
                    });

                    elasticQuestionAnswerDocuments.push({
                        create_user_id: answer.create_user_id,
                        question_id:  question._id.toString(),
                        question_tags: question.tags,
                        question_title: question.title,
                        question_describe: question.describe,
                        answer_content: answer.content,
                        create_time: answer.create_time,
                        update_time: answer.update_time,
                    });
                });

                elasticsearch.bulk({
                    body: elasticQuestionAnswerDocuments
                }, cb);
            },
        }, callback);
    });
};


/**
 * @desc 初始化推荐数据
 * */
const initRecommend = function (callback) {
    let recommends = [];

    let avatar = 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518';

    for (let i = 0; i < 100; i++) {

        let userID = new mongodb.ObjectId();
        let questionID = new mongodb.ObjectId();
        let answerID = new mongodb.ObjectId();
        let activityID = new mongodb.ObjectId();
        let articleID = new mongodb.ObjectId();

        let user = {
            _id: userID,
            status: User.STATUS.NORMAL, //用户状态
            getui_cid: '58ad029de4b015ad71990518',
            user_name: Mock.Random.ctitle(4, 6),   //用户名
            user_profile: Mock.Random.ctitle(10, 20),   //用户简介
            user_avatar: avatar,   //用户头像
            create_time: new Date(),     //创建时间
            update_time: new Date(),     //更新时间
            user_gender: false, //用户性别
            user_mobile: '13120975917',  //用户手机
            work_info: Mock.Random.ctitle(10, 20),  //用户性别
            edu_info: Mock.Random.ctitle(10, 20),  //用户性别
        };

        let question = {
            "_id": questionID,
            "status": 1,
            "title": Mock.Random.ctitle(5, 20),
            "describe": Mock.Random.ctitle(50, 100),
            "answer_count": 0,
            "favour_count": 0,
            "attention_count": 1,
            "collect_count": 0,
            "create_user_id": userID,
            "create_time": new Date(),
            "update_time": new Date(),
            "tags": [],
        };

        let answer = {
            "_id": answerID,
            "status": 1,
            "content": Mock.Random.ctitle(20, 50),
            "comment_count": 0,
            "favour_count": 0,
            "collect_count": 0,
            "question_id": questionID,
            "create_user_id": userID,
            "create_time": new Date(),
            "update_time": new Date(),
        };

        let activity = {
            _id: activityID,
            status: Activity.STATUS.DISPLAY,   //回答状态
            title: Mock.Random.ctitle(10, 20),   //回答内容
            cover: avatar,   //封面图片URL
            describe: Mock.Random.ctitle(10, 20),   //封面图片URL
            url: 'http://www.baidu.com',  //活动地址URL
            favour_count: 0,   //点赞数量
            comment_count: 0,   //评论数量
            collect_count: 0,   //收藏数量
            create_time: new Date(),   //创建时间
            update_time: new Date(),   //更新时间
        };

        let article = {
            _id: articleID,
            status: Article.STATUS.PUBLISHED,    //文章状态
            top: false,    //是否置顶
            title: Mock.Random.ctitle(10, 20),    //文章标题
            summary: Mock.Random.ctitle(10, 20),    //文章摘要
            icon: avatar,    //文章图标
            cover: avatar,    //封面图片
            tags: ['基金'],    //文章标签
            content: Mock.Random.ctitle(100, 200),    //文章内容
            browse_count: 0,    //浏览次数
            favour_count: 0,    //被赞次数
            comment_count: 0,    //被评论次数
            collect_count: 0,    //被收藏次数
            create_time: new Date(),    //创建时间
            update_time: new Date(),    //更新时间
            subject_id: SUBJECT_ID,  //文章所属主题
            create_user_id: null   //创建人
        };

        let tempRecommends = [];

        tempRecommends.push({
            status: Recommend.STATUS.NORMAL,   //状态
            order: Mock.Random.natural(1, 100),   //排序方式
            type: Recommend.TYPE.QUESTION,   //排序方式
            create_time: new Date(),     //排序方式
            update_time: new Date(),     //排序方式
            question: questionID,
            answer: answerID,
            user: userID,
            activity: null,  //推荐活动
            article: null,  //推荐文章
        });

        tempRecommends.push({
            status: Recommend.STATUS.NORMAL,   //状态
            order: Mock.Random.natural(1, 100),   //排序方式
            type: Recommend.TYPE.ACTIVITY,   //排序方式
            create_time: new Date(),     //排序方式
            update_time: new Date(),     //排序方式
            question: null,  //推荐问题
            activity: activityID,  //推荐活动
            article: null,  //推荐文章
        });

        tempRecommends.push({
            status: Recommend.STATUS.NORMAL,   //状态
            order: Mock.Random.natural(1, 100),   //排序方式
            type: Recommend.TYPE.ARTICLE,   //排序方式
            create_time: new Date(),     //排序方式
            update_time: new Date(),     //排序方式
            question: null,  //推荐问题
            activity: null,  //推荐活动
            article: articleID,  //推荐文章
        });


        let temp = {
            user: user,
            question: question,
            answer: answer,
            activity: activity,
            article: article,
            recommends: tempRecommends
        };

        recommends.push(temp);
    }

    async.eachLimit(recommends, 10, function (recommend, cb) {

        async.series([
            function (cb) {
                User.create(recommend.user, cb);
            },

            function (cb) {
                Question.create(recommend.question, cb);
            },

            function (cb) {
                QuestionAnswer.create(recommend.answer, cb);
            },

            function (cb) {
                Activity.create(recommend.activity, cb);
            },

            function (cb) {
                Article.create(recommend.article, cb);
            },

            function (cb) {
                Recommend.create(recommend.recommends, cb);
            },
        ], cb);

    }, callback);
};

/**
 * @desc 初始化收藏
 * */
const initCollection = function (callback) {

    let avatar = 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518';


    let answerID = new mongodb.ObjectId();
    let questionID = new mongodb.ObjectId();
    let articleID = new mongodb.ObjectId();

    let question = {
        "_id": questionID,
        "status": 1,
        "title": Mock.Random.ctitle(5, 20),
        "describe": Mock.Random.ctitle(50, 100),
        "answer_count": 0,
        "favour_count": 0,
        "attention_count": 1,
        "collect_count": 0,
        "create_user_id": USER_ID,
        "create_time": new Date(),
        "update_time": new Date(),
        "tags": [],
    };

    let answer = {
        "_id": answerID,
        "status": 1,
        "content": Mock.Random.ctitle(20, 50),
        "comment_count": 0,
        "favour_count": 0,
        "collect_count": 0,
        "question_id": questionID,
        "create_user_id": USER_ID,
        "create_time": new Date(),
        "update_time": new Date(),
    };

    let article = {
        _id: articleID,
        status: Article.STATUS.PUBLISHED,    //文章状态
        top: false,    //是否置顶
        title: Mock.Random.ctitle(10, 20),    //文章标题
        summary: Mock.Random.ctitle(10, 20),    //文章摘要
        icon: avatar,    //文章图标
        cover: avatar,    //封面图片
        tags: ['基金'],    //文章标签
        content: Mock.Random.ctitle(100, 200),    //文章内容
        browse_count: 0,    //浏览次数
        favour_count: 0,    //被赞次数
        comment_count: 0,    //被评论次数
        collect_count: 0,    //被收藏次数
        create_time: new Date(),    //创建时间
        update_time: new Date(),    //更新时间
        subject_id: SUBJECT_ID,  //文章所属主题
        create_user_id: null   //创建人
    };

    let tempArticleCollections = [
        {
            status: UserArticleCollection.STATUS.COLLECTED,   //收藏状态
            create_time: new Date(),   //创建时间
            update_time: new Date(),   //更新时间
            subject_id: SUBJECT_ID,         //收藏对象ID
            article_id: articleID,          //收藏对象ID
            user_id: USER_ID,             //收藏用户ID
        }
    ];

    let tempAnswerCollections = [
        {
            status: UserArticleCollection.STATUS.COLLECTED,   //收藏状态
            create_time: new Date(),   //创建时间
            update_time: new Date(),   //更新时间
            question_id: QUESTION_ID,         //收藏对象ID
            answer_id: answerID,          //收藏对象ID
            user_id: USER_ID,             //收藏用户ID
        }
    ];

    async.parallel({
        insertQuestion: function (cb) {
            Question.create(question, cb);
        },
        insertArticle: function (cb) {
            Article.create(article, cb);
        },
        insertAnswer: function (cb) {
            QuestionAnswer.create(answer, cb);
        },
    }, function (err, results) {

        if (err) {
            return callback(err);
        }

        async.parallel({
            insertCollectionArticle: function (cb) {
                UserArticleCollection.create(tempArticleCollections, cb);
            },
            insertCollectionAnswer: function (cb) {
                UserAnswerCollection.create(tempAnswerCollections, cb);
            },
        }, callback);

    });
    
};


/**
 * @desc 初始化用户数据
 * */
const initUser = function (callback) {

    let avatar = 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518';

    let userDoc = [
        {
            _id: USER_ID,
            status: User.STATUS.NORMAL, //用户状态
            user_name: 'synder',   //用户名
            user_profile: Mock.Random.ctitle(10, 20),   //用户简介
            getui_cid: '36a3c303c90eadf908acae5526163235',
            user_avatar: avatar,   //用户头像
            create_time: new Date(),     //创建时间
            update_time: new Date(),     //更新时间
            user_gender: false, //用户性别
            user_mobile: '',  //用户手机
            user_password : "", //用户密码
            pass_salt_str : "", //盐
            work_info: Mock.Random.ctitle(10, 20),  //用户性别
            edu_info: Mock.Random.ctitle(10, 20),  //用户性别
            bind_tencent_wechat : {
                "uid" : "58aa50177ddbf5507c51f086",
                "union_id" : null,
                "name" : "liqp"
            }
        },
        {
            _id: '58aa50177ddbf5507c51f084',
            status: User.STATUS.NORMAL, //用户状态
            user_name: 'synder',   //用户名
            getui_cid: '36a3c303c90eadf908acae5526163235',
            user_profile: Mock.Random.ctitle(10, 20),   //用户简介
            user_avatar: avatar,   //用户头像
            create_time: new Date(),     //创建时间
            update_time: new Date(),     //更新时间
            user_gender: false, //用户性别
            user_mobile: '15921116190',  //用户手机
            user_password : "36a3c303c90eadf908acae5526163235", //用户密码
            pass_salt_str : "0.7487739197849146", //盐
            work_info: Mock.Random.ctitle(10, 20),  //用户性别
            edu_info: Mock.Random.ctitle(10, 20),  //用户性别
        },
        {
            _id: USER_ID_OTHER,
            status: User.STATUS.NORMAL,   //用户状态
            user_name: 'sam',   //用户名
            getui_cid: '36a3c303c90eadf908acae5526163235',
            user_profile: Mock.Random.ctitle(10, 20),   //用户简介
            user_avatar: avatar,   //用户头像
            create_time: new Date(),     //创建时间
            update_time: new Date(),     //更新时间
            user_gender: false, //用户性别
            user_mobile: '13120975916',  //用户手机
            work_info: Mock.Random.ctitle(10, 20),  //用户性别
            edu_info: Mock.Random.ctitle(10, 20),  //用户性别
        }
    ];

    User.create(userDoc, callback);

};

/**
 * @desc 初始化标签数据库
 * */
const initQuestionTags = function (callback) {

    let icon = 'http://www.jkinst.com/zy-api/a/db/mongod/picture/58ad029de4b015ad71990518';

    let tags = [{
        status: QuestionTag.STATUS.RECOMMEND,
        title: '基金',
        icon: icon,
        describe: '基金（Fund）从广义上说，基金是指为了某种目的而设立的具有一定数量的资金。主要包括信托投资基金、公积金、保险基金、退休基金，各种基金会的基金。人们平常所说的基金主要是指证券投资基金',
        create_time: new Date(),
        update_time: new Date()
    }];

    for (let i = 0; i < 12; i++) {
        tags.push({
            status: QuestionTag.STATUS.RECOMMEND,
            title: Mock.Random.ctitle(2, 4),
            icon: icon,
            describe: Mock.Random.ctitle(20, 30),
            create_time: new Date(),
            update_time: new Date()
        });
    }

    for (let i = 0; i < 12; i++) {
        tags.push({
            status: QuestionTag.STATUS.ENABLE,
            title: Mock.Random.ctitle(2, 4),
            icon: icon,
            describe: Mock.Random.ctitle(20, 30),
            create_time: new Date(),
            update_time: new Date()
        });
    }

    elasticsearch.deleteByQuery({
        index: elasticsearch.indices.tags,
        body: {
            query: {
                match_all: ''
            }
        }
    }, function (error, response) {
        QuestionTag.create(tags, function (err, tags) {
            if (err) {
                return callback(err);
            }

            let elasticTagsDocuments = [];

            tags.forEach(function (tag) {
                elasticTagsDocuments.push({
                    "index": {
                        "_index": elasticsearch.indices.tags,
                        "_type": elasticsearch.indices.tags,
                        "_id": tag._id.toString()
                    }
                });
                elasticTagsDocuments.push({
                    icon: tag.icon,
                    title: tag.title,
                    describe: tag.describe,
                });
            });

            elasticsearch.bulk({
                body: elasticTagsDocuments
            }, callback);
        });
    });
};

/*
 * @desc 初始化验证码
 * */

const initMongodbSecurityCode = function (callback) {

    let now = new Date();
    let expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 30);

    let securityCodeDoc = [
        {
            _id: '58bce997fc71500981a75187',
            uid: '58bce997fc71500981a75187',
            status: SecurityCode.STATUS.ENABLE,   //验证码状态
            mobile: '13550501565',        //手机号码
            code: '903488',         //验证码
            use_count: 0,            //已验证次数
            expire_time: expireTime,   //过期时间
            create_time: now,          //创建时间
            update_time: now,          //更新次数
        },
        {
            _id: '58bce997fc71500981a75188',
            uid: '58bce997fc71500981a75188',
            status: SecurityCode.STATUS.ENABLE,   //验证码状态
            mobile: '13550501566',        //手机号码
            code: '903487',         //验证码
            use_count: 0,            //已验证次数
            expire_time: expireTime,   //过期时间
            create_time: now,          //创建时间
            update_time: now,          //更新次数
        }
    ];

    SecurityCode.create(securityCodeDoc, callback);
};

exports.init = function (callback) {

    emptyCollection(function () {

        async.parallel([

            function (cb) {
                initSubject(cb);
            },

            function (cb) {
                initArticle(cb);
            },

            function (cb) {
                initUserNotification(cb);
            },

            function (cb) {
                initQuestion(cb);
            },

            function (cb) {
                initQuestionAnswer(cb);
            },

            function (cb) {
                initUser(cb);
            },

            function (cb) {
                initRecommend(cb);
            },

            function (cb) {
                initCollection(cb);
            },

            function (cb) {
                initQuestionTags(cb);
            },

            function (cb) {
                initMongodbSecurityCode(cb);
            }

        ], callback);

    });
};



