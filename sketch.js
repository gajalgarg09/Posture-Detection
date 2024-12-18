let capture;
let posenet;
let singlePose;
let singlePoseskeleton;

function setup() {
    createCanvas(800 , 600); // Match canvas size to smaller video
    capture = createCapture(VIDEO);
    capture.size(800 , 600); // Reduce video resolution for better performance
    capture.hide();

    posenet = ml5.poseNet(capture, modelLoaded);
    posenet.on('pose', receivedPoses);
}

function modelLoaded() {
    console.log('PoseNet model loaded');
}

function receivedPoses(poses) {
    if (poses.length > 0) {
        singlePose = poses[0].pose;
        singlePoseskeleton = poses[0].skeleton;
    }
}

function draw() {
    image(capture, 0, 0, width, height); // Draw video on canvas

    if (singlePose) {

        // Draw keypoints
        fill(255, 0, 0); // Red for keypoints
        noStroke();
        for (let i = 0; i < singlePose.keypoints.length; i++) {
            let keypoint = singlePose.keypoints[i];
            if (keypoint.score > 0.2) { 
                // Only draw keypoints with sufficient confidence
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }

        // Draw skeleton
        if (singlePoseskeleton) {
            stroke(255, 255, 255); // White for connections
            strokeWeight(2);
            for (let j = 0; j < singlePoseskeleton.length; j++) {
                let partA = singlePoseskeleton[j][0];
                let partB = singlePoseskeleton[j][1];

                if (partA.score > 0.2 && partB.score > 0.2) { // Confidence check
                    line(
                        partA.position.x, partA.position.y, partB.position.x, partB.position.y);
                }
            }  
        }
    }
}
