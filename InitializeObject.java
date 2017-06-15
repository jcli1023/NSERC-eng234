

import java.lang.reflect.Field;
import java.util.ArrayList;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfPoint;
import org.opencv.core.MatOfPoint2f;
import org.opencv.core.Point;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;

//Hello this is a comment

public class InitializeObject {

	private static final String EXTENSION_JPEG = ".jpg";

	//args: cameraNum timeName dimX dimY pathJSON 
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		if (args.length == 5)
		{
			try {

				System.setProperty("java.library.path", "lib/x64");

				Field fieldSysPath = ClassLoader.class.getDeclaredField("sys_paths");
				fieldSysPath.setAccessible(true);
				fieldSysPath.set(null, null);

				System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
				long startTime = System.nanoTime();

				String folderName = "CAMERA-" + args[0] + "/";
				String fileName = args[1] + EXTENSION_JPEG;
				String pathName = folderName + fileName;

				double ratioX = Double.valueOf(args[2]);
				double ratioY = Double.valueOf(args[3]);

				JSONParser parser = new JSONParser();
				Object obj;

				try {
					obj = parser.parse(args[4]);
					JSONArray array = (JSONArray) obj;
					JSONObject obj2 = (JSONObject) array.get(1);
					JSONArray strokeColor = (JSONArray) obj2.get("strokeColor");
					JSONArray segments = (JSONArray) obj2.get("segments");
					JSONArray point;
					int polygonNumVertices = segments.size();
					

					
					//map the approximate coordinates from the html video frame to the source frame (* ratio)
					for (int i = 0; i < polygonNumVertices; i++)
					{
						point = (JSONArray)segments.get(i);
						if (point.get(0) instanceof Double)
							point.set(0, Math.round((Double)point.get(0)*ratioX));
						else
							point.set(0, Math.round( (Long)point.get(0)*ratioX));
						
						if (point.get(1) instanceof Double)
							point.set(1, Math.round((Double)point.get(1)*ratioX));
						else
							point.set(1, Math.round( (Long)point.get(1)*ratioX));

					}



					Point[] polygonVertices = new Point[polygonNumVertices];
					for (int i = 0; i < polygonNumVertices; i++)
					{
						point = (JSONArray) segments.get(i);
						polygonVertices[i] = new Point(((Long)point.get(0)).doubleValue(),((Long)point.get(1)).doubleValue());
						//System.out.println(polygonVertices[i]);
					}
					
					Mat rgbImage = Imgcodecs.imread(pathName);
					Mat hsv = new Mat();
					Imgproc.cvtColor(rgbImage, hsv, Imgproc.COLOR_RGB2HSV);
					
					//Create a matrix for mask
					Mat mask = new Mat(rgbImage.rows(), rgbImage.cols(), CvType.CV_8UC1, new Scalar(0));


					MatOfPoint2f roi = new MatOfPoint2f(polygonVertices);
					MatOfPoint2f polygonROI = new MatOfPoint2f();
					//Create an approximation of the polygon 
					Imgproc.approxPolyDP(roi, polygonROI, 1.0, true);
					//Fill in the polygon in the mask	
					MatOfPoint polygonROIPoints = new MatOfPoint(polygonROI.toArray());
					Imgproc.fillConvexPoly(mask, polygonROIPoints, new Scalar(255), 8, 0);

					//Need to split each channel into its own arraylist to get the min and max of each channel
					ArrayList<Mat> hsvChannels = new ArrayList<Mat>();
					Core.split(hsv,hsvChannels);
					
					//Get the min and max values of H
					Core.MinMaxLocResult minMaxValuesH = new Core.MinMaxLocResult();
					minMaxValuesH = Core.minMaxLoc(hsvChannels.get(0),mask);
					//System.out.println("minMaxValuesH: "+minMaxValuesH.minVal+" "+minMaxValuesH.maxVal);
//					Scalar averageH = Core.mean(hsvChannels.get(0),mask);
//					System.out.println("averageH: "+averageH);

					//Get the min and max values of S
					Core.MinMaxLocResult minMaxValuesS = new Core.MinMaxLocResult();
					minMaxValuesS = Core.minMaxLoc(hsvChannels.get(1),mask);
					//System.out.println("minMaxValuesS: "+minMaxValuesS.minVal+" "+minMaxValuesS.maxVal);
//					Scalar averageS = Core.mean(hsvChannels.get(1),mask);
//					System.out.println("averageS: "+averageS);

					//Get the min and max values of V
					Core.MinMaxLocResult minMaxValuesV = new Core.MinMaxLocResult();
					minMaxValuesV = Core.minMaxLoc(hsvChannels.get(2),mask);
					//System.out.println("minMaxValuesV: "+minMaxValuesV.minVal+" "+minMaxValuesV.maxVal);
//					Scalar averageV = Core.mean(hsvChannels.get(2),mask);
//					System.out.println("averageV: "+averageV);


					//Create a mask for thresholding the object HSV
					Mat objectThresholdMask = new Mat();
//					Scalar lowerBound = new Scalar(minMaxValuesH.minVal-10,100,100);
//					Scalar upperBound = new Scalar(minMaxValuesH.maxVal+10,255,255);
//					System.out.println(averageH.val[0]+","+averageS.val[0]+","+averageV.val[0]);
//					System.out.println(averageH.val[0]*1.15+","+averageS.val[0]*1.15+","+averageV.val[0]*1.15);
//					System.out.println(averageH.val[0]*0.85+","+averageS.val[0]*0.85+","+averageV.val[0]*0.85);
					
//					Scalar upperBound = new Scalar(averageH.val[0]*1.25,averageS.val[0]*1.25,averageV.val[0]*1.25);
//					Scalar lowerBound = new Scalar(averageH.val[0]*0.75,averageS.val[0]*0.75,averageV.val[0]*0.75);
//					Scalar upperBound = new Scalar(minMaxValuesH.maxVal+10,255,255);
//					Scalar lowerBound = new Scalar(minMaxValuesH.minVal-10,100,150);
                                        Scalar upperBound = new Scalar(minMaxValuesH.maxVal+10,255,255);
					Scalar lowerBound = new Scalar(minMaxValuesH.minVal-10,150,60);
					Core.inRange(hsv,lowerBound,upperBound,objectThresholdMask);

//					Imgcodecs.imwrite("objectThresholdMask_initialize_"+fileName,objectThresholdMask);
					 
					int erosionSize = 15;
					int dilationSize = 15;

					//Erode the objectThresholdMask to remove small noise
					Mat element = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, new Size(2*erosionSize + 1, 2*erosionSize+1));
					Imgproc.erode(objectThresholdMask, objectThresholdMask, element);

					//Dilate the objectThresholdMask to fill in small holes
					Mat element1 = Imgproc.getStructuringElement(Imgproc.MORPH_RECT, new  Size(2*dilationSize + 1, 2*dilationSize+1));
					Imgproc.dilate(objectThresholdMask, objectThresholdMask, element1);

					//Mask after eroding then dilating
					Mat finalThresholdMask = new Mat(objectThresholdMask.rows(), objectThresholdMask.cols(), CvType.CV_8UC1, new Scalar(0));
					objectThresholdMask.copyTo(finalThresholdMask);

					//List of contours
					ArrayList<MatOfPoint> contours = new ArrayList<MatOfPoint>();
					Mat hierarchy = new Mat(); 
					Imgproc.findContours(finalThresholdMask, contours, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_NONE);
					
					double largestContourArea = 0.0;
					double currentContourArea = 0.0;
					int largestContourIndex = 0;

					//Find the largest contour based on its area
					for( int i = 0; i< contours.size(); i++ )
					{
						currentContourArea = Imgproc.contourArea( contours.get(i),false); 

						if(currentContourArea > largestContourArea){
							largestContourArea = currentContourArea;
							largestContourIndex=i;               
						}
					}

//					Mat drawing2 = new Mat(hsv.rows(),hsv.cols(),CvType.CV_8UC1, new Scalar(1,1,0));
//						Scalar color = new Scalar( 0, 0, 100 );
//						Imgproc.drawContours(drawing2, contours, largestContourIndex, color, 2, 8, hierarchy, 0, new Point() );
//						Mat imageTest2 = new Mat(hsv.rows(), hsv.cols(), CvType.CV_8UC3, new Scalar(1,1,0));
//						hsv.copyTo(imageTest2,drawing2);
//						Imgcodecs.imwrite("contourOverlay_initialize_"+fileName,imageTest2);
					 

					//Points of the contour selected by the user
					Point[] maxContourPoints = contours.get(largestContourIndex).toArray();

					//System.out.println("segments0: "+segments.toJSONString());

					//clear original segments to contour coordinates
					segments.clear();

					long xContour, yContour;

					//map the contour coordinates to the approximate html coordinates (/ ratio)
					for (int i = 0; i < maxContourPoints.length; i++)
					{
						JSONArray contourPoints = new JSONArray();
						xContour = ((Double)(maxContourPoints[i].x / ratioX)).longValue();
						yContour = ((Double)(maxContourPoints[i].y / ratioY)).longValue();
						contourPoints.add(xContour);
						contourPoints.add(yContour);
						segments.add(contourPoints);
					}

					//Change strokeColor to signify processed contour
					strokeColor.set(0, 0);
					strokeColor.set(1, 0);
					strokeColor.set(2, 1);

					//System.out.println("segments1: "+segments.toJSONString());

//					JSONObject hMinMaxValues = new JSONObject();
//					JSONArray hMinMaxArray = new JSONArray();
//					hMinMaxArray.add(minMaxValuesH.minVal-10);
//					hMinMaxArray.add(minMaxValuesH.maxVal+10);
//
//					hMinMaxValues.put("hMinMax", hMinMaxArray);
//					array.add(hMinMaxValues);

					JSONObject minValues = new JSONObject();
					JSONArray minArray = new JSONArray();
					minArray.add(lowerBound.val[0]);
					minArray.add(lowerBound.val[1]);
					minArray.add(lowerBound.val[2]);

					minValues.put("minValues", minArray);
					array.add(minValues);

					JSONObject maxValues = new JSONObject();
					JSONArray maxArray = new JSONArray();
					maxArray.add(upperBound.val[0]);
					maxArray.add(upperBound.val[1]);
					maxArray.add(upperBound.val[2]);

					maxValues.put("maxValues", maxArray);
					array.add(maxValues);
					
					JSONObject objectFound = new JSONObject();
					if (maxContourPoints.length > 0)
						objectFound.put("objectFound", "true");
					else
						objectFound.put("objectFound", "false");

					array.add(objectFound);
					
					JSONObject trajectoryCenter = new JSONObject();
					JSONArray trajectoryArray = new JSONArray();
					trajectoryArray.add(10.0);
					trajectoryArray.add(10.0);
					
					trajectoryCenter.put("trajectoryCenter", trajectoryArray);
					
					array.add(trajectoryCenter);

					System.out.println(obj.toString());

				} catch (ParseException e) {
					e.printStackTrace();
				}

				long endTime = System.nanoTime();
				long totalTime = endTime - startTime;
				//System.out.println("totalTime: "+totalTime);

			} catch (Exception ex) {
				ex.printStackTrace();
				throw new RuntimeException(ex);
			}

		}
		else
		{
			System.out.println("Correct usage of InitializeObject args: cameraNum timeName dimX dimY pathJSON");
			System.out.println("args.length: "+ args.length);
			System.exit(0);
		}

	}

}
