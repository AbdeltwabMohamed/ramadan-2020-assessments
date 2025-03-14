var VideoRequest = require('./../models/video-requests.model');

module.exports = {
  createRequest: (vidRequestData) => {
    let newRequest = new VideoRequest(vidRequestData);
    return newRequest.save();
  },

  getAllVideoRequests: (top) => {
    return VideoRequest.find({}).sort({ submit_date: '-1' }).limit(top);
    
  },

  searchRequests: (topic) => {
    return VideoRequest.find({ topic_title: topic })
      .sort({ addedAt: '-1' })
      .limit(top);
  },

  getRequestById: (id) => {
    return VideoRequest.findById({ _id: id });
  },

  updateRequest: (id, status, resVideo) => {
    const updates = {
      status: status,
      video_ref: {
        link: resVideo,
        date: resVideo && new Date(),
      },
    };

    return VideoRequest.findByIdAndUpdate(id, updates, { new: true });
  },

  updateVoteForRequest: async (id, vote_type,userid) => {
    const oldRequest = await VideoRequest.findById({ _id: id });
    const other_type = vote_type === 'ups' ? 'downs' : 'ups';

   
    if(oldRequest.votes[vote_type].includes(userid)){
      return {message:"you have already voted"}
    }
    // if(oldRequest.votes[other_type].includes(userid)){
    //  oldRequest.votes[other_type].splice(oldRequest.votes[other_type].indexOf(userid),1)
    // }
    oldRequest.votes[vote_type].push(userid);
    return VideoRequest.findByIdAndUpdate(
      { _id: id },
      {
        votes: {
          [vote_type]: oldRequest.votes[vote_type],
          [other_type]: oldRequest.votes[other_type],
        },
      },{new :true}
    );
  },

  deleteRequest: (id) => {
    return VideoRequest.deleteOne({ _id: id });
  },
};
