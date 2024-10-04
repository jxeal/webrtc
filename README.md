# WebRTC Application

Practice for learning webrtc

Process to use the file

1. Clone the repo
2. Use live server extension, go live.
3. Open 2 windows of the same file to connect to each other
4. Create an offer from either one. The offer SDP will be copied automatically
5. Signal the offer SDP to the other peer.
6. Paste the (already copied) SDP in the other peer's Join input box and click Join. The answer SDP will be created and copied.
7. Then again signal the answer SDP to the first peer.
8. Paste the answer SDP in the Create Offer input box of first peer.
9. It is connected now (hopefully!)

Now you can have a video call from one peer to other.

Note:- For some reason the stream breaks when someone turns their camera off.
