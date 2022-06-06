package kr.or.ih.api.web;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import kr.or.ih.api.entity.Crop;
import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.MarkerFile;
import kr.or.ih.api.entity.Notice;
import kr.or.ih.api.entity.Outcome;
import kr.or.ih.api.entity.Pagination;
import kr.or.ih.api.entity.User;
import kr.or.ih.api.service.HomeService;
import kr.or.ih.api.service.MarkerService;
import kr.or.ih.api.service.ScheduleService;
import tm.massmail.sendapi.ThunderMassMailSender;
import tm.massmail.sendapi.ThunderMassMail;


@Controller
public class MarkerController
{
	@Autowired
	private MarkerService service;
	
	@Autowired
	private HomeService homeService;
	
	@Autowired
	private ScheduleService scheduleService;
	
	@Autowired
	private FileController fileController;
	
	private RunGetLength runController;
	
	// 마커정보 목록
	@RequestMapping("/marker_list")
	public ModelAndView MarkerList(ModelAndView mv, HttpServletRequest request, @RequestParam(value = "page_num", defaultValue = "1") int page_num)
	{
		HttpSession session = request.getSession();
		
			User user = (User)session.getAttribute("user");
			

				int count = service.SelectMarkerCount();
				
				int limit = 10;
				int offset = (page_num - 1) * limit;
				int start_page = ((page_num - 1) / 5) * 5 + 1;
				int end_page = (count + limit - 1) / limit;
				
				Pagination page = new Pagination();
				page.setCount(count);
				page.setPage_num(page_num);
				page.setStart_page(start_page);
				page.setEnd_page(end_page);
				page.setOffset(offset);
				page.setLimit(limit);
				
				List<Crop> crop = service.SelectCrop();
				List<Marker> marker = service.SelectMarker(offset, limit);
				List<Notice> notice = homeService.SelectNotice("liberty@dnacare.co.kr");

				mv.addObject("user", user);
				mv.addObject("crop", crop);
				mv.addObject("marker", marker);
				mv.addObject("notice", notice);
				mv.addObject("page", page);
				
				mv.setViewName("marker/marker_list");		
		
		return mv;
	}
	
	// 마커 상세 조회
	@ResponseBody
	@RequestMapping("selectMarkerDetail")
	public Map<String, Object> SelectMarkerDetail(@RequestParam("marker_id") int marker_id)
	{
		Map<String, Object> result = new HashMap<String, Object>();
		
		Marker marker = service.SelectMarkerDetail(marker_id);
		List<MarkerFile> file = service.SelectMarkerFile(marker_id);
		
		result.put("marker", marker);
		result.put("file", file);
		
		return result;
	}
	
	// 결과 데이터 목록
	@RequestMapping("/result_list")
	public ModelAndView ResultList(ModelAndView mv, HttpServletRequest request, @RequestParam(value = "page_num", defaultValue = "1") int page_num)
	{
		HttpSession session = request.getSession();
		
			User user = (User)session.getAttribute("user");
			

				int count = service.SelectOutcomeCount();
				
				int limit = 10;
				int offset = (page_num - 1) * limit;
				int start_page = ((page_num - 1) / 5) * 5 + 1;
				int end_page = (count + limit - 1) / limit;
				
				Pagination page = new Pagination();
				page.setCount(count);
				page.setPage_num(page_num);
				page.setStart_page(start_page);
				page.setEnd_page(end_page);
				page.setOffset(offset);
				page.setLimit(limit);
				
				List<Crop> crop = service.SelectCrop();
				List<Outcome> outcome = service.SelectOutcomeList(offset, limit);
				List<Notice> notice = homeService.SelectNotice("liberty@dnacare.co.kr");

				mv.addObject("user", user);
				mv.addObject("crop", crop);
				mv.addObject("outcome", outcome);
				mv.addObject("notice", notice);
				mv.addObject("page", page);
				
				mv.setViewName("marker/result_list");

		
		return mv;
	}

	// 사용자 분석 결과 데이터 목록
	@RequestMapping("/userresult_list")
	public ModelAndView UserresultList(ModelAndView mv, HttpServletRequest request, @RequestParam(value = "page_num", defaultValue = "1") int page_num)
	{
		HttpSession session = request.getSession();
		
		//if(session.getAttribute("user") == null)
		//{
		//	mv.setViewName("redirect:/login");
		//}
		//else
		//{
			User user = (User)session.getAttribute("user");

				int count = service.SelectOutcomeCount();
				
				int limit = 10;
				int offset = (page_num - 1) * limit;
				int start_page = ((page_num - 1) / 5) * 5 + 1;
				int end_page = (count + limit - 1) / limit;
				
				Pagination page = new Pagination();
				page.setCount(count);
				page.setPage_num(page_num);
				page.setStart_page(start_page);
				page.setEnd_page(end_page);
				page.setOffset(offset);
				page.setLimit(limit);
				
				List<Crop> crop = service.SelectCrop();
				List<Outcome> outcome = service.SelectOutcomeList(offset, limit);
				List<Notice> notice = homeService.SelectNotice("liberty@dnacare.co.kr");

				mv.addObject("user", user);
				mv.addObject("crop", crop);
				mv.addObject("outcome", outcome);
				mv.addObject("notice", notice);
				mv.addObject("page", page);
				
				mv.setViewName("userdata/userresult_list");
		//}
		
		return mv;
	}
	
	// 작물 등록
	@ResponseBody
	@RequestMapping("insertCrop")
	public int InsertCrop(@RequestParam("new_crop") String new_crop)
	{
		int chk_crop = service.CheckCrop(new_crop);

		if(chk_crop == 0)
		{
			int result = service.InsertCrop(new_crop);
			
			if(result == 0)
			{
				return 0;
			}
			else
			{
				return 1;
			}
		}
		else
		{
			return 2;
		}
	}
	
	// 작물별 버전 정보 조회
	@ResponseBody
	@RequestMapping("selectMarkerVersion")
	public List<Marker> SelectMarkerVersion(@RequestParam("marker_crop") String marker_crop)
	{
		List<Marker> result = service.SelectMarkerVersion(marker_crop);
		
		if(result == null)
		{
			return new ArrayList<Marker>();
		}
		
		return result;
	}
	
	@ResponseBody
	@RequestMapping("selectUseMarkerVersion")
	public List<Marker> SelectUseMarkerVersion(@RequestParam("marker_crop") String marker_crop)
	{
		List<Marker> result = service.SelectUseMarkerVersion(marker_crop);
		
		if(result == null)
		{
			return new ArrayList<Marker>();
		}
		
		return result;
	}
	
	// 마커정보 등록
	@ResponseBody
	@RequestMapping("insertMarker")
	public int InsertMarker(ModelAndView mv, HttpServletRequest request, @RequestParam Map<String,String> params, @RequestParam(required = false, value = "fasta_file") MultipartFile fasta_file, @RequestParam(required = false, value = "length_file") MultipartFile length_file, @RequestParam(required = false, value = "gff_file") MultipartFile gff_file, @RequestParam(required = false, value = "marker_file") MultipartFile marker_file) throws IOException
	{
		Marker marker = new Marker();
		marker.setMarker_crop(params.get("marker_crop"));
		marker.setMarker_version(params.get("marker_version"));
		marker.setMarker_contents(params.get("marker_contents"));
		marker.setMarker_credit(params.get("marker_credit"));
		marker.setMarker_status(Integer.parseInt(params.get("marker_status")));
		
		int marker_result = service.InsertMarker(marker);
		
		Date date = new Date();
		String date_name = (1900 + date.getYear()) + "" + (date.getMonth() + 1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
		
		String path = "/data/apache-tomcat-9.0.8/webapps/ROOT/common/r/result/" + date_name;
		
		File filePath = new File(path);
		
		if (!filePath.exists())
			filePath.mkdirs();
		
        try
        {
        	if(!fasta_file.isEmpty())
        	{
        		String[] fasta_extension = fasta_file.getOriginalFilename().split("\\.");
        		String fasta_name = date_name + "." + fasta_extension[fasta_extension.length - 1];
        		
        		fasta_file.transferTo(new File(path + "/" + fasta_name));
        		
        		MarkerFile file = new MarkerFile();
        		file.setMarker_id(marker.getMarker_id());
        		file.setMarker_file_type(0);
        		file.setMarker_file("/digit/common/r/result/" + date_name + "/" + fasta_name);
        		file.setMarker_origin_file(fasta_file.getOriginalFilename());
        		
        		int file_result = service.InsertMarkerFile(file);
            	
            	if(length_file.isEmpty())
            	{
            		RunGetLength rungetlength = new RunGetLength();
            		
            		rungetlength.MakeRunGetLength(date_name, fasta_name);
            		
            		file = new MarkerFile();
            		file.setMarker_id(marker.getMarker_id());
            		file.setMarker_file_type(1);
            		file.setMarker_file("/digit/common/r/result/" + date_name + "/" + "lengh.len");
            		file.setMarker_origin_file(fasta_name);
            		
            		file_result = service.InsertMarkerFile(file);
            	}
        	}
        	if(!length_file.isEmpty())
        	{
        		String[] length_extension = length_file.getOriginalFilename().split("\\.");
        		String length_name = date_name + "." + length_extension[length_extension.length - 1];
        		
        		length_file.transferTo(new File(path + "/" + length_name));
        		MarkerFile file = new MarkerFile();
        		file.setMarker_id(marker.getMarker_id());
        		file.setMarker_file_type(1);
        		file.setMarker_file("/digit/common/r/result/" + date_name + "/" + length_name);
        		file.setMarker_origin_file(length_file.getOriginalFilename());
        		
        		int file_result = service.InsertMarkerFile(file);
        		
        	}
        	if(!gff_file.isEmpty())
        	{
        		String[] gff_extension = gff_file.getOriginalFilename().split("\\.");
        		String gff_name = date_name + "." + gff_extension[gff_extension.length - 1];
        		
        		gff_file.transferTo(new File(path + "/" + gff_name));
        		
        		MarkerFile file = new MarkerFile();
        		file.setMarker_id(marker.getMarker_id());
        		file.setMarker_file_type(2);
        		file.setMarker_file("/digit/common/r/result/" + date_name + "/" + gff_name);
        		file.setMarker_origin_file(gff_file.getOriginalFilename());
        		
        		int file_result = service.InsertMarkerFile(file);
        	}
        	if(!marker_file.isEmpty())
        	{
        		String[] marker_extension = marker_file.getOriginalFilename().split("\\.");
        		String marker_name = date_name + "." + marker_extension[marker_extension.length - 1];
        		
        		marker_file.transferTo(new File(path + "/" + marker_name));
        		
        		MarkerFile file = new MarkerFile();
        		file.setMarker_id(marker.getMarker_id());
        		file.setMarker_file_type(3);
        		file.setMarker_file("/digit/common/r/result/" + date_name + "/" + marker_name);
        		file.setMarker_origin_file(marker_file.getOriginalFilename());
        		
        		int file_result = service.InsertMarkerFile(file);
        	}
        }
        catch(IOException e)
        {
        	System.out.println("error");
        }
		
		mv.setViewName("redirect:/marker_list");
		
		return marker_result;
	}
	
	// 마커 정보 수정
	@ResponseBody
	@RequestMapping("updateMarker")
	public int UpdateMarker(@RequestParam Map<String, String> params, @RequestParam(required = false, value = "fasta_file") MultipartFile fasta_file, @RequestParam(required = false, value = "length_file") MultipartFile length_file, @RequestParam(required = false, value = "gff_file") MultipartFile gff_file, @RequestParam(required = false, value = "marker_file") MultipartFile marker_file)
	{
		Marker marker = new Marker();
		marker.setMarker_id(Integer.parseInt(params.get("marker_id")));
		marker.setMarker_version(params.get("marker_version"));
		marker.setMarker_credit(params.get("marker_credit"));
		marker.setMarker_status(Integer.parseInt(params.get("marker_status")));
		marker.setMarker_contents(params.get("marker_contents"));
		
		int result = service.UpdateMarker(marker);
		
		Date date = new Date();
		String date_name = (1900 + date.getYear()) + "" + (date.getMonth() + 1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
		
		String path = "/data/apache-tomcat-9.0.8/webapps/ROOT/common/r/result/" + date_name;
		
		File filePath = new File(path);
		
		if (!filePath.exists())
			filePath.mkdirs();
		
        try
        {
        	if(!fasta_file.isEmpty())
        	{
        		String[] fasta_extension = fasta_file.getOriginalFilename().split("\\.");
        		String fasta_name = date_name + "." + fasta_extension[fasta_extension.length - 1];
        		
        		fasta_file.transferTo(new File(path + "/" + fasta_name));
        		
        		MarkerFile file = new MarkerFile();
        		file.setMarker_id(marker.getMarker_id());
        		file.setMarker_file_type(0);
        		file.setMarker_file("/digit/common/r/result/" + date_name + "/" + fasta_name);
        		file.setMarker_origin_file(fasta_file.getOriginalFilename());
        		
        		int file_result = service.UpdateMarkerFile(file);
        	}
        	if(!length_file.isEmpty())
        	{
        		String[] length_extension = length_file.getOriginalFilename().split("\\.");
        		String length_name = date_name + "." + length_extension[length_extension.length - 1];
        		
        		length_file.transferTo(new File(path + "/" + length_name));
        		MarkerFile file = new MarkerFile();
        		file.setMarker_id(marker.getMarker_id());
        		file.setMarker_file_type(1);
        		file.setMarker_file("/digit/common/r/result/" + date_name + "/" + length_name);
        		file.setMarker_origin_file(length_file.getOriginalFilename());
        		
        		int file_result = service.UpdateMarkerFile(file);
        		
        	}
        	if(!gff_file.isEmpty())
        	{
        		String[] gff_extension = gff_file.getOriginalFilename().split("\\.");
        		String gff_name = date_name + "." + gff_extension[gff_extension.length - 1];
        		
        		gff_file.transferTo(new File(path + "/" + gff_name));
        		
        		MarkerFile file = new MarkerFile();
        		file.setMarker_id(marker.getMarker_id());
        		file.setMarker_file_type(2);
        		file.setMarker_file("/digit/common/r/result/" + date_name + "/" + gff_name);
        		file.setMarker_origin_file(gff_file.getOriginalFilename());
        		
        		int file_result = service.UpdateMarkerFile(file);
        	}
        	if(!marker_file.isEmpty())
        	{
        		String[] marker_extension = marker_file.getOriginalFilename().split("\\.");
        		String marker_name = date_name + "." + marker_extension[marker_extension.length - 1];
        		
        		marker_file.transferTo(new File(path + "/" + marker_name));
        		
        		MarkerFile file = new MarkerFile();
        		file.setMarker_id(marker.getMarker_id());
        		file.setMarker_file_type(3);
        		file.setMarker_file("/digit/common/r/result/" + date_name + "/" + marker_name);
        		file.setMarker_origin_file(marker_file.getOriginalFilename());
        		
        		int file_result = service.UpdateMarkerFile(file);
        	}
        }
        catch(IOException e)
        {
        	System.out.println("error");
        }
		
		return result;
	}
	
	// 결과 데이터 등록
	@ResponseBody
	@RequestMapping("insertOutcome")
	public int InsertOutcome(ModelAndView mv, @RequestParam Map<String,String> params, @RequestParam("file") MultipartFile file)
	{
		String user_username = params.get("user_username");
		String user_comment = params.get("outcome_comment");
		Outcome outcome = new Outcome();
		outcome.setUser_username(params.get("user_username"));
		outcome.setMarker_id(Integer.parseInt(params.get("marker_id")));
		outcome.setOutcome_type(Integer.parseInt(params.get("outcome_type")));
		outcome.setOutcome_status(Integer.parseInt(params.get("outcome_status")));
		outcome.setOutcome_comment(params.get("outcome_comment"));

		Date date = new Date();
		String date_name = (1900 + date.getYear()) + "" + (date.getMonth() + 1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
		
		String path = "/data/apache-tomcat-9.0.8/webapps/ROOT/upload/outcomeFile/" + date_name;
		
		File filePath = new File(path);
		
		if (!filePath.exists())
			filePath.mkdirs();
		
		try
		{
			file.transferTo(new File(path + "/" + file.getOriginalFilename()));
			
			if(outcome.getOutcome_type() == 6 || outcome.getOutcome_type() == 8)
			{
				RunUnzip runUnzip = new RunUnzip();
				runUnzip.MakeRunRunGetIndex(path, file.getOriginalFilename());
			}
		}
        catch(IOException e)
        {
        	System.out.println("error");
        }
		
		outcome.setOutcome_file("upload/outcomeFile/" + date_name + "/" + file.getOriginalFilename());
		outcome.setOutcome_origin_file(file.getOriginalFilename());
		
		int result = service.InsertOutcome(outcome);
		
		int notice = scheduleService.InsertNotice(outcome);
		
		 ThunderMassMailSender tms = new ThunderMassMailSender();
         ThunderMassMail tm = new ThunderMassMail();
         tm.setThunderMailURL("192.168.50.42:8080");               
         tm.setWriter("seedcenter");

         tm.setMailTitle("안녕하세요 " + user_username +"님");                        
         tm.setSenderEmail("ymjeong@koat.or.kr");                  
         tm.setSenderName("디지털육종정보화시스템");                        
         tm.setReceiverName(user_username);                              

         tm.setContentType("content");
         tm.setMailContent("디지털육종정보화시스템에 분석 결과가 등록 되었습니다.<br><br> https://seedcenter.koat.or.kr/digit/ 에서 확인 해 주시기 바랍니다.<br><br><br>전달사항 : " + user_comment);

         tm.setTargetType("string");
         tm.setTargetString("이메일,고객명,휴대폰Æ"+user_username+","+user_username+","+"000-000-0000Æ");
         tm.setFileOneToOne("[$email]≠["+user_username+"]ø[$name]≠["+user_username+"]ø[$cellPhone]≠[000-000-0000]");
         String result_mail = tms.send(tm); 
         System.out.println("result_mail : " + result_mail);	
         
		return result;
	}
	
	// 결과 데이터 상세 조회
	@ResponseBody
	@RequestMapping("selectOutcomeDetail")
	public Outcome SelectOutcomeDetail(@RequestParam("outcome_id") int outcome_id)
	{
		Outcome result = service.SelectOutcomeDetail(outcome_id);
		
		return result;
	}
	
	// 결과 데이터 수정
	@ResponseBody
	@RequestMapping("updateOutcome")
	public int UpdateOutcome(@RequestParam Map<String,String> params, @RequestParam(required = false, value = "file") MultipartFile file)
	{
		Outcome outcome = new Outcome();
		outcome.setOutcome_id(Integer.parseInt(params.get("outcome_id")));
		outcome.setUser_username(params.get("user_username"));
		outcome.setMarker_id(Integer.parseInt(params.get("marker_id")));
		outcome.setOutcome_type(Integer.parseInt(params.get("outcome_type")));
		outcome.setOutcome_status(Integer.parseInt(params.get("outcome_status")));
		outcome.setOutcome_comment(params.get("outcome_comment"));
		outcome.setOutcome_file(params.get("outcome_file"));
		outcome.setOutcome_origin_file(params.get("outcome_origin_name"));
		
		if(!file.isEmpty())
		{
			Date date = new Date();
			String date_name = (1900 + date.getYear()) + "" + (date.getMonth() + 1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
			
			String path = "/data/apache-tomcat-9.0.8/webapps/ROOT/upload/outcomeFile/" + date_name;
			
			File deleteFile = new File("/data/apache-tomcat-9.0.8/webapps/ROOT/" + outcome.getOutcome_file());

			boolean delete = true;
			
			/*
			if(deleteFile.exists())
			{
				delete = deleteFile.delete();
			}
			*/
			
			if(delete)
			{
				File filePath = new File(path);
				
				if (!filePath.exists())
					filePath.mkdirs();
				
				try
				{
					file.transferTo(new File(path + "/" + file.getOriginalFilename()));
					
					outcome.setOutcome_file("upload/outcomeFile/" + date_name + "/" + file.getOriginalFilename());
					outcome.setOutcome_origin_file(file.getOriginalFilename());
				}
				catch(IOException e)
				{
					System.out.println("error");
				}
			}
		}
		
		int result = service.UpdateOutcome(outcome);
		
		return result;
	}
	
	@ResponseBody
	@RequestMapping("insertNewOutcome")
	public int InsertNewOutcome(@RequestParam Map<String,String> params)
	{
		Outcome outcome = new Outcome();
		outcome.setUser_username(params.get("user_username"));
		outcome.setOutcome_type(Integer.parseInt(params.get("outcome_type")));
		outcome.setOutcome_comment(params.get("outcome_comment"));
		
		if(outcome.getOutcome_type() == 4)
		{
			outcome.setOutcome_file(params.get("outcome_file") + "_upgma.png");
			outcome.setOutcome_status(1);
		}
		else if(outcome.getOutcome_type() == 5)
		{
			outcome.setOutcome_file(params.get("outcome_file") + "_minimal_markers.txt");
			outcome.setOutcome_status(2);
		}
		else if(outcome.getOutcome_type() == 6)
		{
			outcome.setOutcome_file(params.get("outcome_file") + ".zip");
			outcome.setOutcome_status(1);
		}
		else if(outcome.getOutcome_type() == 7)
		{
			outcome.setMarker_id(Integer.parseInt(params.get("marker_id")));
			outcome.setOutcome_file(params.get("outcome_file") + "_abh_result.xlsx");
			outcome.setOutcome_status(2);
		}
		else if(outcome.getOutcome_type() == 8)
		{
			outcome.setMarker_id(Integer.parseInt(params.get("marker_id")));
			outcome.setOutcome_file(params.get("outcome_file") + "_result.txt");
			outcome.setOutcome_status(2);
		}
		
		int result = service.InsertOutcome(outcome);
		
		return result;
	}
	
	@ResponseBody
	@RequestMapping("insertOutcomeResult")
	public int InsertOutcomeResult(@RequestParam("user_username") String user_username, @RequestParam("marker_id") int marker_id, @RequestParam("outcome_type") int outcome_type, @RequestParam("outcome_comment") String outcome_comment, @RequestParam(required = false, value = "outcome_result") String outcome_result, @RequestParam(required = false, value = "file") MultipartFile file)
	{
		Outcome outcome = new Outcome();
		outcome.setUser_username(user_username);
		outcome.setMarker_id(marker_id);
		outcome.setOutcome_type(outcome_type);
		outcome.setOutcome_result(outcome_result);
		outcome.setOutcome_comment(outcome_comment);
		
		if(outcome_type == 1 || outcome_type == 2 || outcome_type == 3)
		{
			Date date = new Date();
			String date_name = (1900 + date.getYear()) + "" + (date.getMonth() + 1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
			
			String path = "/data/apache-tomcat-9.0.8/webapps/ROOT/upload/outcomeFile/" + date_name;
			
			File filePath = new File(path);
			
			if (!filePath.exists())
				filePath.mkdirs();
			
			try
			{
				file.transferTo(new File(path + "/" + file.getOriginalFilename()));
				outcome.setOutcome_status(1);
				outcome.setOutcome_file("upload/outcomeFile/" + date_name + "/" + file.getOriginalFilename());
				outcome.setOutcome_origin_file(file.getOriginalFilename());
			}
	        catch(IOException e)
	        {
	        	System.out.println("error");
	        }
		}
		
		int result = service.InsertOutcome(outcome);
		
		return result;
	}
	
	@ResponseBody
	@RequestMapping("updateOutcomeResult")
	public int UpdateOutcomeResult(@RequestParam("outcome_id") int outcome_id, @RequestParam("outcome_result") String outcome_result)
	{
		int result = service.UpdateOutcomeResult(outcome_id, outcome_result);
		
		return result;
	}
}