package kr.or.ih.api.web;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.concurrent.CompletableFuture;

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
import kr.or.ih.api.entity.Notice;
import kr.or.ih.api.entity.Outcome;
import kr.or.ih.api.entity.Pagination;
import kr.or.ih.api.entity.User;
import kr.or.ih.api.service.HomeService;
import kr.or.ih.api.service.SnpService;

@Controller
public class SnpController
{
	@Autowired
	private SnpService service;
	
	@Autowired
	private HomeService homeService;
	
	// snp 목록 페이지
	@RequestMapping("/snp_list")
	public ModelAndView SNPList(ModelAndView mv, HttpServletRequest request, @RequestParam(value = "page_num", defaultValue = "1") int page_num)
	{
		HttpSession session = request.getSession();
		
		if(session.getAttribute("user") == null)
		{
			mv.setViewName("redirect:/login");
		}
		else
		{
			User user = (User)session.getAttribute("user");
			
			int count = service.SelectOutcomeCount(user.getUser_username());
			
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
			
			List<Outcome> outcome = service.SelectOutcomeList(user.getUser_username(), offset, limit);
			List<Notice> notice = homeService.SelectNotice(user.getUser_username());

			mv.addObject("outcome", outcome);
			mv.addObject("notice", notice);
			mv.addObject("page", page);
			
			mv.setViewName("snp/snp_list");
		}
		
		return mv;
	}
	
	// snp 상세 페이지
	@RequestMapping("/snp_detail")
	public ModelAndView SNPDetail(ModelAndView mv, HttpServletRequest request, @RequestParam("outcome_id") int outcome_id)
	{
		HttpSession session = request.getSession();

		if(session.getAttribute("user") == null)
		{
			mv.setViewName("redirect:/login");
		}
		else
		{
			User user = (User)session.getAttribute("user");
			
			int delete = homeService.DeleteNotice(user.getUser_username(), outcome_id);

			Outcome outcome = service.SelectOutcome(outcome_id);
			
			List<Notice> notice = homeService.SelectNotice(user.getUser_username());
			
			mv.addObject("outcome", outcome);
			mv.addObject("notice", notice);
			
			mv.setViewName("snp/snp_detail");
		}
		
		return mv;
	}
	
	// snp 신규 페이지
	@RequestMapping("/snp_add")
	public ModelAndView SNPAdd(ModelAndView mv, HttpServletRequest request)
	{
		HttpSession session = request.getSession();

		if(session.getAttribute("user") == null)
		{
			mv.setViewName("redirect:/login");
		}
		else
		{
			User user = (User)session.getAttribute("user");

			List<Crop> crop = service.SelectCrop();
			List<Notice> notice = homeService.SelectNotice(user.getUser_username());
			
			mv.addObject("crop", crop);
			mv.addObject("notice", notice);
			
			mv.setViewName("snp/snp_add");
		}
		
		return mv;
	}
	
	// snp 등록
	@ResponseBody
	@RequestMapping("insertSNP")
	public String InsertSNP(@RequestParam("marker_id") int marker_id, @RequestParam("sample_name") String[] sample_name, @RequestParam("first_file") MultipartFile[] first_file, @RequestParam("second_file") MultipartFile[] second_file)
	{
		Date date = new Date();
		String date_name = (1900 + date.getYear()) + "" + (date.getMonth() + 1) + "" + date.getDate() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
		String path = "/data/apache-tomcat-9.0.8/webapps/ROOT/common/web/snpanalysis/resultfiles/" + date_name;
		
		File filePath = new File(path);
		
		if (!filePath.exists())
			filePath.mkdirs();
		
		String marker_file = service.SelectMarkerFileName(marker_id);
		
		String sample = "";
		String first = "";
		String second = "";
		
		try
		{
			if(sample_name != null)
			{
				for(int i = 0; i < sample_name.length; i++)
				{
					first_file[i].transferTo(new File(path + "/" + first_file[i].getOriginalFilename()));
					second_file[i].transferTo(new File(path + "/" + second_file[i].getOriginalFilename()));
					
					if(i != (sample_name.length - 1))
					{
						sample += sample_name[i] + " ";
						first += first_file[i].getOriginalFilename() + " "; 
						second += second_file[i].getOriginalFilename() + " "; 
					}
					else
					{
						sample += sample_name[i];
						first += first_file[i].getOriginalFilename(); 
						second += second_file[i].getOriginalFilename(); 
					}
				}
				
				String sample_total = sample;
				String first_total = first;
				String second_total = second;
				
				RunSNP runsnp = new RunSNP();
				CompletableFuture.runAsync(() -> runsnp.MakeRunSNP(date_name, "/data/apache-tomcat-9.0.8/webapps/ROOT" + marker_file, sample_total, first_total, second_total));
			}
			else
			{
				System.out.println("sample name is null");
			}
			
		}
        catch(IOException e)
        {
        	System.out.println("error");
        }
		
		return "common/web/snpanalysis/resultfiles/" + date_name + "/" + date_name;
	}
}