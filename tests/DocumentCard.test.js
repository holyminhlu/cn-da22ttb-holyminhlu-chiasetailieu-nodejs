/**
 * Snapshot test for DocumentCard component
 * This test ensures the component renders correctly and maintains consistent UI
 */

import { mount } from '@vue/test-utils'
import DocumentCard from '../src/components/DocumentCard.vue'

describe('DocumentCard', () => {
  const mockDocument = {
    id: 'd1',
    title: 'Slide Đại số tuyến tính',
    thumbnail: '/img/articles/baigiang.jpg',
    authors: ['Nguyễn Văn A'],
    program: 'Toán',
    tags: ['Đại số', 'Lý thuyết', 'Vector', 'Linear Algebra'],
    downloads: 1240,
    rating: 4.8,
    year: 2024,
    fileType: 'PDF',
    license: 'CC-BY',
    fileUrl: '/files/linear.pdf'
  }

  it('renders correctly with all props', () => {
    const wrapper = mount(DocumentCard, {
      props: {
        document: mockDocument
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('displays title correctly', () => {
    const wrapper = mount(DocumentCard, {
      props: {
        document: mockDocument
      }
    })

    expect(wrapper.find('.title').text()).toBe(mockDocument.title)
  })

  it('displays authors correctly', () => {
    const wrapper = mount(DocumentCard, {
      props: {
        document: mockDocument
      }
    })

    const authorInfo = wrapper.find('.author-info')
    expect(authorInfo.exists()).toBe(true)
    expect(authorInfo.text()).toContain('Nguyễn Văn A')
  })

  it('displays program correctly', () => {
    const wrapper = mount(DocumentCard, {
      props: {
        document: mockDocument
      }
    })

    const programInfo = wrapper.find('.program-info')
    expect(programInfo.exists()).toBe(true)
    expect(programInfo.text()).toContain('Toán')
  })

  it('shows max 3 tags with +n indicator', () => {
    const wrapper = mount(DocumentCard, {
      props: {
        document: mockDocument
      }
    })

    const tags = wrapper.findAll('.tag')
    // Should show 3 tags + 1 "+n" tag
    expect(tags.length).toBe(4)
    expect(tags[3].text()).toBe('+1')
  })

  it('displays downloads and rating', () => {
    const wrapper = mount(DocumentCard, {
      props: {
        document: mockDocument
      }
    })

    expect(wrapper.text()).toContain('1.2k') // 1240 downloads
    expect(wrapper.text()).toContain('4.8') // rating
  })

  it('handles preview action', async () => {
    const wrapper = mount(DocumentCard, {
      props: {
        document: mockDocument
      }
    })

    const previewBtn = wrapper.find('.action-btn[aria-label="Xem trước"]')
    await previewBtn.trigger('click')

    expect(wrapper.emitted('preview')).toBeTruthy()
    expect(wrapper.emitted('preview')[0][0]).toEqual(mockDocument)
  })

  it('handles download action', async () => {
    const wrapper = mount(DocumentCard, {
      props: {
        document: mockDocument
      }
    })

    const downloadBtn = wrapper.find('.action-btn[aria-label="Tải xuống"]')
    await downloadBtn.trigger('click')

    expect(wrapper.emitted('download')).toBeTruthy()
    expect(wrapper.emitted('download')[0][0]).toEqual(mockDocument)
  })

  it('handles save action', async () => {
    const wrapper = mount(DocumentCard, {
      props: {
        document: mockDocument
      }
    })

    const saveBtn = wrapper.find('.action-btn[aria-label="Lưu tài liệu"]')
    await saveBtn.trigger('click')

    expect(wrapper.emitted('save')).toBeTruthy()
  })

  it('handles document without authors', () => {
    const docWithoutAuthors = { ...mockDocument, authors: null }
    const wrapper = mount(DocumentCard, {
      props: {
        document: docWithoutAuthors
      }
    })

    expect(wrapper.find('.author-info').exists()).toBe(false)
  })

  it('handles document with single author string', () => {
    const docWithStringAuthor = { ...mockDocument, author: 'Single Author', authors: null }
    const wrapper = mount(DocumentCard, {
      props: {
        document: docWithStringAuthor
      }
    })

    expect(wrapper.find('.author-info').text()).toContain('Single Author')
  })
})

